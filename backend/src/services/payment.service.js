import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Transaction } from '../models/index.js';
import Appointment, { APPOINTMENT_STATUS } from '../models/Appointment.js';
import { ApiError } from '../utils/apiError.js';

let rz;
function client() {
  if (rz) return rz;
  rz = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  return rz;
}

export async function createOrder({ appointmentId, amount, currency = 'INR', userId }) {
  const appt = await Appointment.findById(appointmentId);
  if (!appt) throw new ApiError(404, 'Appointment not found');
  const order = await client().orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt: appt.bookingCode,
    notes: { appointmentId: appt._id.toString(), userId: userId.toString() },
  });
  const tx = await Transaction.create({
    user: userId, appointment: appt._id, provider: 'razorpay',
    providerOrderId: order.id, amount, currency, status: 'created',
  });
  return { order, transactionId: tx._id };
}

export async function verifyPayment({ orderId, paymentId, signature }) {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  if (expected !== signature) throw new ApiError(400, 'Invalid signature');
  const tx = await Transaction.findOne({ providerOrderId: orderId });
  if (!tx) throw new ApiError(404, 'Transaction not found');
  tx.providerPaymentId = paymentId;
  tx.providerSignature = signature;
  tx.status = 'paid';
  await tx.save();
  await Appointment.updateOne({ _id: tx.appointment }, { $set: { status: APPOINTMENT_STATUS.CONFIRMED, payment: tx._id } });
  return tx;
}

export function verifyWebhookSignature({ rawBody, signature }) {
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest('hex');
  return expected === signature;
}
