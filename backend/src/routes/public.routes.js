import { Router } from 'express';
import * as c from '../controllers/public.controller.js';
import { validate } from '../middlewares/validate.js';
import { contactSchema } from '../validators/schemas.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { ROLES } from '../models/User.js';

const r = Router();

r.get('/therapists', c.listTherapists);
r.get('/therapists/:slug', c.getTherapistBySlug);

r.get('/services', c.listServices);
r.get('/services/:slug', c.getServiceBySlug);

r.get('/blogs', c.listBlogs);
r.get('/blogs/:slug', c.getBlogBySlug);

r.get('/testimonials', c.listTestimonials);
r.get('/faqs', c.listFaqs);
r.get('/seo/:pageKey', c.getSeo);
r.get('/settings/public', c.getPublicSettings);

r.post('/contact', validate(contactSchema), c.submitContact);

// therapist self-management (their own schedule)
r.put('/therapists/:therapistId/availability', authenticate(), authorize(ROLES.THERAPIST, ROLES.ADMIN), c.upsertAvailability);
r.post('/therapists/:therapistId/blocked-dates', authenticate(), authorize(ROLES.THERAPIST, ROLES.ADMIN), c.addBlockedDate);
r.post('/therapists/:therapistId/generate-slots', authenticate(), authorize(ROLES.THERAPIST, ROLES.ADMIN), c.generateSlots);

export default r;
