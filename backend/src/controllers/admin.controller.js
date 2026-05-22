import User from '../models/User.js';
import Therapist from '../models/Therapist.js';
import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import { Blog, Testimonial, Faq, ContactMessage, Settings, SeoMetadata, Transaction, AuditLog } from '../models/index.js';
import { asyncHandler, ok, ApiError } from '../utils/apiError.js';

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

// SERVICES CMS
export const createService = asyncHandler(async (req, res) => {
  const s = await Service.create(req.body);
  audit(req, 'service.create', 'Service', s._id);
  ok(res, s, 'Created', 201);
});
export const updateService = asyncHandler(async (req, res) => {
  const s = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!s) throw new ApiError(404, 'Service not found');
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
  const b = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

export const listContact = asyncHandler(async (_req, res) =>
  ok(res, await ContactMessage.find().sort({ createdAt: -1 })));
