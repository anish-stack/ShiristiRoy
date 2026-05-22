import { Router } from 'express';
import express from 'express';
import { asyncHandler, ok } from '../utils/apiError.js';
import { authenticate } from '../middlewares/auth.js';
import * as pay from '../services/payment.service.js';

const r = Router();

r.post('/order', authenticate(), asyncHandler(async (req, res) => {
  const out = await pay.createOrder({ ...req.body, userId: req.user.id });
  ok(res, out, 'Order created');
}));

r.post('/verify', authenticate(), asyncHandler(async (req, res) => {
  const tx = await pay.verifyPayment(req.body);
  ok(res, tx, 'Payment verified');
}));

// Webhook (raw body needed for HMAC). Mount before json parser at route level.
r.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const raw = req.body.toString();
  if (!pay.verifyWebhookSignature({ rawBody: raw, signature })) return res.status(400).end();
  // process event...
  return res.json({ received: true });
}));

export default r;
