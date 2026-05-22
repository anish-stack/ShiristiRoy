import { Router } from 'express';
import * as c from '../controllers/booking.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { bookingLimiter } from '../middlewares/rateLimit.js';
import { bookingSchemas } from '../validators/schemas.js';

const r = Router();

// public slot listing
r.get('/slots', c.listAvailableSlots);
r.get('/admin/slots', c.adminListSlots);
r.patch('/slots/:slotId', c.adminBlockSlot);


r.post("/check-slot", c.checkSelectedSlot);

// auth required
r.use(authenticate());

r.post('/slots/:slotId/hold', bookingLimiter, c.holdSlot);
r.delete('/slots/:slotId/hold', c.releaseHold);

r.post('/', bookingLimiter, validate(bookingSchemas.book), c.book);
r.get('/me', c.myAppointments);
r.patch('/:id/cancel', c.cancel);
r.patch('/:id/reschedule', validate(bookingSchemas.reschedule), c.reschedule);

export default r;
