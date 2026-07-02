import User from '../models/User.js';
import Therapist from '../models/Therapist.js';
import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import { Blog, Testimonial, Faq, ContactMessage, Settings, SeoMetadata, Transaction, AuditLog } from '../models/index.js';
import { asyncHandler, ok, ApiError } from '../utils/apiError.js';
import { sendEmail, templates } from '../services/email.service.js';

// Tiny dependency-free slugify (avoids needing an extra npm package)
function slugify(str, _opts) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
}

const audit = (req, action, entity, entityId, diff = null) =>
  AuditLog.create({
    actor: req.user?.id, action, entity, entityId, diff,
    ip: req.ip, userAgent: req.headers['user-agent'],
  }).catch(() => { });

// DASHBOARD
export const dashboard = asyncHandler(async (_req, res) => {
  const [users, appts, revenue, pending] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Appointment.countDocuments(),
    Transaction.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Appointment.countDocuments({ status: 'pending' }),
  ]);
  ok(res, { users, appts, revenue: revenue[0]?.total || 0, pending });
});

// USERS
export const listUsers = asyncHandler(async (req, res) => {
  const { role, q, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);
  ok(res, { items, total });
});

export const toggleUserActive = asyncHandler(async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) throw new ApiError(404, 'User not found');
  u.isActive = !u.isActive;
  await u.save();
  audit(req, 'user.toggle_active', 'User', u._id, { isActive: u.isActive });
  ok(res, u);
});

// GET /admin/users/:id — full profile + appointment history + transactions
export const getUser = asyncHandler(async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) throw new ApiError(404, 'User not found');

  const appointments = await Appointment.find({ user: u._id })
    .populate('therapist', 'slug title')
    .populate('service', 'name slug')
    .populate('payment')
    .sort({ startAt: -1 });

  const transactions = await Transaction.find({ user: u._id }).sort({ createdAt: -1 });

  ok(res, { user: u, appointments, transactions });
});

export const updateUser = asyncHandler(async (req, res) => {
  const allowed = (({ name, phone, role, isActive, isEmailVerified, meta }) =>
    ({ name, phone, role, isActive, isEmailVerified, meta }))(req.body);
  Object.keys(allowed).forEach((k) => allowed[k] === undefined && delete allowed[k]);
  const u = await User.findByIdAndUpdate(req.params.id, allowed, { new: true });
  if (!u) throw new ApiError(404, 'User not found');
  audit(req, 'user.update', 'User', u._id, allowed);
  ok(res, u);
});

// THERAPISTS
export const createTherapist = asyncHandler(async (req, res) => {
  const { userId, ...rest } = req.body;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  user.role = 'therapist';
  await user.save();
  const t = await Therapist.create({ user: userId, ...rest });
  audit(req, 'therapist.create', 'Therapist', t._id);
  ok(res, t, 'Created', 201);
});

export const updateTherapist = asyncHandler(async (req, res) => {
  const t = await Therapist.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!t) throw new ApiError(404, 'Therapist not found');
  audit(req, 'therapist.update', 'Therapist', t._id, req.body);
  ok(res, t);
});

// APPOINTMENTS (admin view)
export const listAllAppointments = asyncHandler(async (req, res) => {
  const { status, therapist, user, from, to, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (therapist) filter.therapist = therapist;
  if (user) filter.user = user;
  if (from || to) filter.startAt = {};
  if (from) filter.startAt.$gte = new Date(from);
  if (to) filter.startAt.$lte = new Date(to);
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Appointment.find(filter).populate('user', 'name email').populate('therapist', 'slug')
      .sort({ startAt: -1 }).skip(skip).limit(Number(limit)),
    Appointment.countDocuments(filter),
  ]);
  ok(res, { items, total });
});

// GET /admin/appointments/:id — everything: user, therapist, service, slot,
// payment (with intake form + consent form URLs), cancellation/reschedule info
export const getAppointmentDetail = asyncHandler(async (req, res) => {
  const a = await Appointment.findById(req.params.id)
    .populate('user', 'name email phone avatar')
    .populate('therapist', 'slug title')
    .populate('service', 'name slug price durationMin')
    .populate('slot')
    .populate('payment')
    .populate('cancellation.by', 'name email');
  if (!a) throw new ApiError(404, 'Appointment not found');
  ok(res, a);
});

// PATCH /admin/appointments/:id/status  body: { status, reason }
// status: confirmed | rejected | completed | no_show | cancelled
// Sends the appropriate email to the client for each transition.
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status, reason } = req.body;
  const allowed = ['confirmed', 'rejected', 'cancelled', 'completed', 'no_show'];
  if (!allowed.includes(status)) throw new ApiError(400, 'Invalid status');

  const a = await Appointment.findById(req.params.id)
    .populate('user', 'name email')
    .populate('therapist', 'slug title');
  if (!a) throw new ApiError(404, 'Appointment not found');

  // 'rejected' is stored as 'cancelled' on the appointment (schema has no
  // separate rejected state) but the client still gets a distinct rejection email.
  const dbStatus = status === 'rejected' ? 'cancelled' : status;
  a.status = dbStatus;
  if (status === 'rejected' || status === 'cancelled') {
    a.cancellation = { at: new Date(), by: req.user.id, reason: reason || 'Rejected by admin' };
  }
  await a.save();

  audit(req, `appointment.${status}`, 'Appointment', a._id, { reason });

  if (a.user?.email) {
    const startAt = a.startAt?.toString();
    const therapistName = a.therapist?.title || 'Srishti Roy';
    let mail = null;
    if (status === 'confirmed') {
      mail = templates.bookingConfirmed({ therapistName, startAt, bookingCode: a.bookingCode, mode: a.mode, meetingUrl: a.meeting?.url });
    } else if (status === 'rejected') {
      mail = templates.bookingRejected({ bookingCode: a.bookingCode, startAt, reason });
    } else if (status === 'cancelled') {
      mail = templates.bookingCancelled({ bookingCode: a.bookingCode, startAt });
    } else if (status === 'completed') {
      mail = templates.bookingCompleted({ bookingCode: a.bookingCode, therapistName });
    }
    if (mail) await sendEmail({ to: a.user.email, ...mail }).catch(() => {});
  }

  ok(res, a, `Appointment ${status}`);
});

// PATCH /admin/appointments/:id — free-form edit (intake notes, mode, meeting link, etc.)
export const updateAppointment = asyncHandler(async (req, res) => {
  const allowed = (({ intake, meeting, mode, startAt, endAt }) => ({ intake, meeting, mode, startAt, endAt }))(req.body);
  Object.keys(allowed).forEach((k) => allowed[k] === undefined && delete allowed[k]);
  const a = await Appointment.findByIdAndUpdate(req.params.id, allowed, { new: true }).populate('payment');
  if (!a) throw new ApiError(404, 'Appointment not found');
  audit(req, 'appointment.update', 'Appointment', a._id, allowed);
  ok(res, a);
});

// PATCH /admin/appointments/:id/consent  body: { action: 'approve' | 'reject', reason }
// Lets admin approve/reject the uploaded consent form. On reject, clears the
// consent flag so the client is asked to re-upload, and emails them why.
export const reviewConsent = asyncHandler(async (req, res) => {
  const { action, reason } = req.body;
  if (!['approve', 'reject'].includes(action)) throw new ApiError(400, 'Invalid action');

  const a = await Appointment.findById(req.params.id).populate('payment').populate('user', 'name email');
  if (!a) throw new ApiError(404, 'Appointment not found');
  if (!a.payment) throw new ApiError(404, 'No payment/consent record for this appointment');

  const txn = a.payment;
  if (action === 'approve') {
    txn.consentDone = true;
    txn.consentStatus = 'approved';
  } else {
    txn.consentDone = false;
    txn.consentStatus = 'rejected';
    txn.consentRejectReason = reason || 'Please re-upload a clearer/valid consent form';
  }
  await txn.save();
  audit(req, `consent.${action}`, 'Transaction', txn._id, { reason });

  if (a.user?.email) {
    const mail = action === 'approve'
      ? templates.consentApproved({ bookingCode: a.bookingCode })
      : templates.consentRejected({ bookingCode: a.bookingCode, reason: txn.consentRejectReason });
    await sendEmail({ to: a.user.email, ...mail }).catch(() => {});
  }

  ok(res, txn, `Consent ${action}d`);
});

// SERVICES CMS
export const createService = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (body.price && typeof body.price === 'string') { try { body.price = JSON.parse(body.price); } catch {} }
  if (body.modes && typeof body.modes === 'string') { try { body.modes = JSON.parse(body.modes); } catch { body.modes = body.modes.split(','); } }
  if (req.uploadedFile) {
    body.coverImage = { url: req.uploadedFile.publicPath, publicId: req.uploadedFile.publicId };
  }
  const s = await Service.create(body);
  audit(req, 'service.create', 'Service', s._id);
  ok(res, s, 'Created', 201);
});
export const updateService = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (body.price && typeof body.price === 'string') { try { body.price = JSON.parse(body.price); } catch {} }
  if (body.modes && typeof body.modes === 'string') { try { body.modes = JSON.parse(body.modes); } catch { body.modes = body.modes.split(','); } }
  if (req.uploadedFile) {
    body.coverImage = { url: req.uploadedFile.publicPath, publicId: req.uploadedFile.publicId };
  }
  const s = await Service.findByIdAndUpdate(req.params.id, body, { new: true });
  if (!s) throw new ApiError(404, 'Service not found');
  audit(req, 'service.update', 'Service', s._id, body);
  ok(res, s);
});
export const deleteService = asyncHandler(async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  ok(res, null, 'Deleted');
});

// BLOG CMS
export const createBlog = asyncHandler(
  async (req, res) => {
    try {
      const {
        title,
        excerpt,
        content,
        tags,
        category,
        status,
        seo,
      } = req.body;

      // Validation
      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message:
            'Title and content are required',
        });
      }

      // Generate slug
      const slug = slugify(title, {
        lower: true,
        strict: true,
        trim: true,
      });

      // Check existing blog
      const existingBlog =
        await Blog.findOne({ slug });

      if (existingBlog) {
        return res.status(400).json({
          success: false,
          message:
            'Blog with same title already exists',
        });
      }

      // Uploaded image from middleware
      let coverImage = undefined;

      if (req.uploadedFile) {
        coverImage = {
          url: req.uploadedFile.publicPath,
          publicId:
            req.uploadedFile.publicId,
          alt: title,
        };
      }

      // Calculate reading time
      const words =
        content?.split(/\s+/).length || 0;

      const readingTimeMin = Math.max(
        1,
        Math.ceil(words / 200)
      );

      // Create blog
      const blog = await Blog.create({
        title,
        slug,
        excerpt,
        content,

        coverImage,

        author: req.user.id,

        tags: Array.isArray(tags)
          ? tags
          : tags
            ? [tags]
            : [],

        category,

        status:
          status || 'draft',

        readingTimeMin,

        publishedAt:
          status === 'published'
            ? new Date()
            : null,

        seo,
      });

      return res.status(201).json({
        success: true,
        message:
          'Blog created successfully',

        data: blog,
      });
    } catch (error) {
      console.error(
        'Create blog error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          'Failed to create blog',
      });
    }
  }
);
export const updateBlog = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (req.uploadedFile) {
    body.coverImage = { url: req.uploadedFile.publicPath, publicId: req.uploadedFile.publicId, alt: body.title };
  }
  const b = await Blog.findByIdAndUpdate(req.params.id, body, { new: true });
  if (!b) throw new ApiError(404, 'Blog not found');
  ok(res, b);
});
export const deleteBlog = asyncHandler(async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  ok(res, null, 'Deleted');
});

// controllers/blog.controller.js

export const GetBlog = asyncHandler(
  async (req, res) => {
    const {
      page = 1,
      limit = 10,

      search,

      category,

      tag,

      status,

      sort = 'latest',
    } = req.query;

    // Pagination
    const currentPage = Math.max(
      1,
      Number(page)
    );

    const perPage = Math.min(
      50,
      Math.max(1, Number(limit))
    );

    const skip =
      (currentPage - 1) * perPage;

    // Filters
    const filter = {};

    // Search
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: 'i',
          },
        },

        {
          excerpt: {
            $regex: search,
            $options: 'i',
          },
        },

        {
          content: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Tag filter
    if (tag) {
      filter.tags = {
        $in: [tag],
      };
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Sorting
    let sortOption = {
      createdAt: -1,
    };

    if (sort === 'oldest') {
      sortOption = {
        createdAt: 1,
      };
    }

    if (sort === 'popular') {
      sortOption = {
        views: -1,
      };
    }

    if (sort === 'published') {
      sortOption = {
        publishedAt: -1,
      };
    }

    // Fetch blogs
    const blogs = await Blog.find(filter)

      .populate(
        'author',
        'name email avatar'
      )

      .sort(sortOption)

      .skip(skip)

      .limit(perPage)

      .lean();

    // Total count
    const total =
      await Blog.countDocuments(filter);

    // Total pages
    const totalPages = Math.ceil(
      total / perPage
    );

    return res.status(200).json({
      success: true,

      message: 'Blogs fetched successfully',

      data: blogs,

      pagination: {
        total,

        totalPages,

        currentPage,

        perPage,

        hasNextPage:
          currentPage < totalPages,

        hasPrevPage:
          currentPage > 1,
      },

      filters: {
        search: search || null,

        category: category || null,

        tag: tag || null,

        status: status || null,

        sort,
      },
    });
  }
);  

// TESTIMONIAL / FAQ / SEO / SETTINGS — minimal CRUD pattern
const crud = (Model) => ({
  create: asyncHandler(async (req, res) => ok(res, await Model.create(req.body), 'Created', 201)),
  update: asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) throw new ApiError(404, 'Not found');
    ok(res, doc);
  }),
  remove: asyncHandler(async (req, res) => { await Model.findByIdAndDelete(req.params.id); ok(res, null, 'Deleted'); }),
  list: asyncHandler(async (_req, res) => ok(res, await Model.find().sort({ createdAt: -1 }))),
});

export const testimonial = crud(Testimonial);
export const faq = crud(Faq);
export const seo = crud(SeoMetadata);
export const settings = crud(Settings);

// POST /admin/settings/upload  form-data: image, key ('brand.logo' | 'brand.heroSlides.0.image' | ...), group
// Uploads an image and upserts it straight into a Settings row so hero/logo
// images can be swapped from the admin panel without touching code.
export const uploadSettingImage = asyncHandler(async (req, res) => {
  if (!req.uploadedFile) throw new ApiError(400, 'No image uploaded');
  const { key, group = 'brand' } = req.body;
  if (!key) throw new ApiError(400, 'key is required, e.g. brand.logo');
  const value = { url: req.uploadedFile.publicPath, publicId: req.uploadedFile.publicId };
  const doc = await Settings.findOneAndUpdate(
    { key },
    { key, value, group },
    { upsert: true, new: true },
  );
  audit(req, 'settings.upload_image', 'Settings', doc._id, { key });
  ok(res, doc, 'Image uploaded', 201);
});

export const listContact = asyncHandler(async (_req, res) =>
  ok(res, await ContactMessage.find().sort({ createdAt: -1 })));
