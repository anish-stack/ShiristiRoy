import { Router } from 'express';
import auth from './auth.routes.js';
import booking from './booking.routes.js';
import publicR from './public.routes.js';
import admin from './admin.routes.js';
import payment from './payment.routes.js';

const r = Router();
r.use('/auth', auth);
r.use('/bookings', booking);
r.use('/admin', admin);
r.use('/payments', payment);
r.use('/', publicR);
export default r;
