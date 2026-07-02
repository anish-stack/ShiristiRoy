import { Router } from 'express';
import * as a from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { ROLES } from '../models/User.js';
import { singleImageUpload, optionalImageUpload } from '../middlewares/upload.js';

const r = Router();
r.get('/blogs', a.GetBlog);
r.use(authenticate(), authorize(ROLES.ADMIN));

r.get('/dashboard', a.dashboard);

r.get('/users', a.listUsers);
r.get('/users/:id', a.getUser);
r.patch('/users/:id', a.updateUser);
r.patch('/users/:id/toggle-active', a.toggleUserActive);

r.post('/therapists', a.createTherapist);
r.patch('/therapists/:id', a.updateTherapist);

r.get('/appointments', a.listAllAppointments);
r.get('/appointments/:id', a.getAppointmentDetail);
r.patch('/appointments/:id', a.updateAppointment);
r.patch('/appointments/:id/status', a.updateAppointmentStatus);
r.patch('/appointments/:id/consent', a.reviewConsent);

// image is optional on create/update — service works with JSON-only body too
r.post('/services', optionalImageUpload('image'), a.createService);
r.patch('/services/:id', optionalImageUpload('image'), a.updateService);
r.delete('/services/:id', a.deleteService);

r.post('/blogs',  singleImageUpload('image'), a.createBlog);

r.patch('/blogs/:id', optionalImageUpload('image'), a.updateBlog);
r.delete('/blogs/:id', a.deleteBlog);

r.get('/testimonials', a.testimonial.list);
r.post('/testimonials', a.testimonial.create);
r.patch('/testimonials/:id', a.testimonial.update);
r.delete('/testimonials/:id', a.testimonial.remove);

r.get('/faqs', a.faq.list);
r.post('/faqs', a.faq.create);
r.patch('/faqs/:id', a.faq.update);
r.delete('/faqs/:id', a.faq.remove);

r.get('/seo', a.seo.list);
r.post('/seo', a.seo.create);
r.patch('/seo/:id', a.seo.update);
r.delete('/seo/:id', a.seo.remove);

r.get('/settings', a.settings.list);
r.post('/settings', a.settings.create);
r.patch('/settings/:id', a.settings.update);
r.post('/settings/upload', singleImageUpload('image'), a.uploadSettingImage);

r.get('/contact-messages', a.listContact);

export default r;
