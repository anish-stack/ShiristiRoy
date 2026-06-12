import Razorpay from 'razorpay';
import crypto from 'crypto';
import { ApiError } from '../utils/apiError.js';
import { Transaction } from '../models/index.js';

const rz = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createOrder({ amount, currency = 'INR', appointmentId, userId, notes = {} }) {
  const order = await rz.orders.create({
    amount: Math.round(amount * 100), // paise
    currency,
    receipt: `appt_${appointmentId}`,
    notes,
  });

  const txn = await Transaction.create({
    user: userId,
    appointment: appointmentId,
    provider: 'razorpay',
    providerOrderId: order.id,
    amount,
    currency,
    status: 'created',
    meta: { order },
  });

  return { txn, order };
}

export function verifySignature({ orderId, paymentId, signature }) {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expected === signature;
}

export async function capturePayment({ txnId, paymentId, signature }) {
  const txn = await Transaction.findById(txnId);
  if (!txn) throw new ApiError(404, 'Transaction not found');

  const valid = verifySignature({
    orderId: txn.providerOrderId,
    paymentId,
    signature,
  });
  if (!valid) {
    txn.status = 'failed';
    await txn.save();
    throw new ApiError(400, 'Payment signature mismatch');
  }

  txn.providerPaymentId = paymentId;
  txn.providerSignature = signature;
  txn.status = 'paid';
  await txn.save();
  return txn;
}

export async function initiateRefund({ txnId, amount, reason = 'cancellation' }) {
  const txn = await Transaction.findById(txnId);
  if (!txn) throw new ApiError(404, 'Transaction not found');
  if (txn.status !== 'paid') throw new ApiError(400, 'Cannot refund unpaid transaction');

  const refundAmount = amount ?? txn.amount; // partial or full

  const rzRefund = await rz.payments.refund(txn.providerPaymentId, {
    amount: Math.round(refundAmount * 100),
    notes: { reason },
  });

  txn.status = 'refunded';
  txn.refund = {
    id: rzRefund.id,
    amount: refundAmount,
    at: new Date(),
    reason,
  };
  await txn.save();
  return txn;
}