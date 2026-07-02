import Therapist from '../models/Therapist.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import { Blog, Testimonial, Faq, ContactMessage, SeoMetadata, Settings } from '../models/index.js';
import { Availability, BlockedDate } from '../models/Slot.js';
import { asyncHandler, ok, ApiError } from '../utils/apiError.js';
import * as slotSvc from '../services/slot.service.js';
import { sendEmail, templates } from '../services/email.service.js';

// THERAPIST
export const listTherapists = asyncHandler(async (req, res) => {
  const { spec, lang, q } = req.query;
  const filter = { isAcceptingClients: true };
  if (spec) filter.specializations = spec;
  if (lang) filter.languages = lang;
  let query = Therapist.find(filter).populate('user', 'name avatar');
  if (q) query = query.find({ $or: [{ title: new RegExp(q, 'i') }, { bio: new RegExp(q, 'i') }] });
  const list = await query.lean();
  ok(res, list);
});

export const getTherapistBySlug = asyncHandler(async (req, res) => {
  const t = await Therapist.findOne({ slug: req.params.slug })
    .populate('user', 'name avatar preferredLanguage').lean();
  if (!t) throw new ApiError(404, 'Therapist not found');
  ok(res, t);
});

export const upsertAvailability = asyncHandler(async (req, res) => {
  const therapistId = req.params.therapistId;
  const items = req.body.items; // [{dayOfWeek, startTime, endTime, slotDurationMin, bufferMin, mode}]
  await Availability.deleteMany({ therapist: therapistId });
  if (items?.length) {
    await Availability.insertMany(items.map((i) => ({ ...i, therapist: therapistId })));
  }
  ok(res, null, 'Availability updated');
});

export const addBlockedDate = asyncHandler(async (req, res) => {
  const item = await BlockedDate.create({ ...req.body, therapist: req.params.therapistId });
  ok(res, item, 'Blocked', 201);
});

export const generateSlots = asyncHandler(async (req, res) => {
  const { from, to } = req.body;
  const out = await slotSvc.generateSlots({
    therapistId: req.params.therapistId, from: new Date(from), to: new Date(to),
  });
  ok(res, out, 'Slots generated');
});

// SERVICE
export const listServices = asyncHandler(async (_req, res) => {
  const list = await Service.find({ isActive: true }).sort({ order: 1 });
  ok(res, list);
});
export const getServiceBySlug = asyncHandler(async (req, res) => {
  const s = await Service.findOne({ slug: req.params.slug });
  if (!s) throw new ApiError(404, 'Service not found');
  ok(res, s);
});

// BLOG
export const listBlogs = asyncHandler(async (req, res) => {
  const { tag, page = 1, limit = 10 } = req.query;
  const q = { status: 'published' };
  if (tag) q.tags = tag;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Blog.find(q).sort({ publishedAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Blog.countDocuments(q),
  ]);
  ok(res, { items, total, page: Number(page), limit: Number(limit) });
});
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const b = await Blog.findOneAndUpdate({ slug: req.params.slug, status: 'published' }, { $inc: { views: 1 } }, { new: true });
  if (!b) throw new ApiError(404, 'Blog not found');
  ok(res, b);
});

// TESTIMONIAL / FAQ / SEO
export const listTestimonials = asyncHandler(async (_req, res) => {
  ok(res, await Testimonial.find({ isPublished: true }).sort({ isFeatured: -1, order: 1 }));
});
export const listFaqs = asyncHandler(async (_req, res) => {
  ok(res, await Faq.find({ isActive: true }).sort({ order: 1 }));
});
export const getSeo = asyncHandler(async (req, res) => {
  const seo = await SeoMetadata.findOne({ pageKey: req.params.pageKey });
  ok(res, seo);
});

// GET /settings/public — logo, hero slides & other public "brand" settings
// (safe subset only — never exposes contact/business/internal groups)
export const getPublicSettings = asyncHandler(async (_req, res) => {
  const rows = await Settings.find({ group: 'brand' });
  const out = {};
  for (const r of rows) out[r.key] = r.value;
  ok(res, out);
});

// CONTACT
export const submitContact = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.create({ ...req.body, ip: req.ip });
  if (process.env.ADMIN_EMAIL) {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      ...templates.adminContactMessage(req.body),
    }).catch(() => {});
  }
  ok(res, { id: msg._id }, 'Message received. We will get back soon.', 201);
});
