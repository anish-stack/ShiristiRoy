import { Router } from 'express';
import * as c from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimit.js';
import { authSchemas } from '../validators/schemas.js';

const r = Router();
r.post('/register', authLimiter, validate(authSchemas.register), c.register);
r.post('/verify-email', validate(authSchemas.verifyEmail), c.verifyEmail);
r.post('/login', authLimiter, validate(authSchemas.login), c.login);
r.post('/google', authLimiter, c.google);
r.post('/refresh', validate(authSchemas.refresh), c.refresh);
r.post('/logout', validate(authSchemas.refresh), c.logout);
r.post('/logout-all', authenticate(), c.logoutAll);
r.post('/forgot', authLimiter, validate(authSchemas.forgot), c.forgot);
r.post('/reset', authLimiter, validate(authSchemas.reset), c.reset);
r.get('/me', authenticate(), c.me);
export default r;
