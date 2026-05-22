import mongoose from 'mongoose';
import crypto from 'crypto';
import { Slot, SlotStatus } from '../models/Slot.js';
import Appointment, { APPOINTMENT_STATUS } from '../models/Appointment.js';
import { Notification, Transaction } from '../models/index.js';
import Therapist from '../models/Therapist.js';
import User from '../models/User.js';
import { redlock, redis } from '../config/redis.js';
import { ApiError } from '../utils/apiError.js';
import { sendEmail, templates } from './email.service.js';
import logger from '../utils/logger.js';

const HOLD_TTL_MS = Number(process.env.SLOT_LOCK_TTL_MS || 10_000);

const lockKey = (slotId) => `lock:slot:${slotId}`;
const holdKey = (slotId) => `hold:slot:${slotId}`;

const code = () => crypto.randomBytes(4).toString('hex').toUpperCase();

/**
 * Hold slot for user (e.g. while payment in progress).
 * Uses Redlock + atomic update with status filter to prevent double-hold.
 */
export async function holdSlot({ slotId, userId, ttlMs = HOLD_TTL_MS }) {
  let lock;
  try {
    lock = await redlock.acquire([lockKey(slotId)], 5000);
    const holdUntil = new Date(Date.now() + ttlMs);
    const updated = await Slot.findOneAndUpdate(
      {
        _id: slotId,
        $or: [
          { status: SlotStatus.AVAILABLE },
          { status: SlotStatus.HELD, heldUntil: { $lt: new Date() } }, // expired hold reclaimable
        ],
      },
      { $set: { status: SlotStatus.HELD, heldBy: userId, heldUntil: holdUntil }, $inc: { version: 1 } },
      { new: true },
    );
    if (!updated) throw new ApiError(409, 'Slot not available');
    await redis.set(holdKey(slotId), userId.toString(), 'PX', ttlMs);
    return updated;
  } finally {
    if (lock) await lock.release().catch(() => {});
  }
}

export async function releaseHold({ slotId, userId }) {
  let lock;
  try {
    lock = await redlock.acquire([lockKey(slotId)], 5000);
    await Slot.updateOne(
      { _id: slotId, status: SlotStatus.HELD, heldBy: userId },
      { $set: { status: SlotStatus.AVAILABLE, heldBy: null, heldUntil: null }, $inc: { version: 1 } },
    );
    await redis.del(holdKey(slotId));
  } finally { if (lock) await lock.release().catch(() => {}); }
}

/**
 * Confirm booking. Mongo transaction across Slot + Appointment.
 * Idempotent: same (user, slot) re-call returns existing appointment.
 */
export async function bookSlot({ userId, slotId, serviceId, intake = {}, mode }) {
  // dedup pre-check
  const existing = await Appointment.findOne({ user: userId, slot: slotId });
  if (existing) return existing;

  let lock;
  try {
    lock = await redlock.acquire([lockKey(slotId)], 6000);

    const session = await mongoose.startSession();
    try {
      let appointment;
      await session.withTransaction(async () => {
        // atomic claim: only succeed if AVAILABLE, or HELD-by-this-user, or expired HELD
        const slot = await Slot.findOneAndUpdate(
          {
            _id: slotId,
            $or: [
              { status: SlotStatus.AVAILABLE },
              { status: SlotStatus.HELD, heldBy: userId },
              { status: SlotStatus.HELD, heldUntil: { $lt: new Date() } },
            ],
          },
          { $set: { status: SlotStatus.BOOKED, heldBy: null, heldUntil: null }, $inc: { version: 1 } },
          { new: true, session },
        );
        if (!slot) throw new ApiError(409, 'Slot already booked or unavailable');

        const therapist = await Therapist.findById(slot.therapist).session(session);
        if (!therapist) throw new ApiError(404, 'Therapist not found');

        const apptDoc = await Appointment.create([{
          bookingCode: `SR-${code()}`,
          user: userId,
          therapist: slot.therapist,
          service: serviceId || undefined,
          slot: slot._id,
          startAt: slot.startAt,
          endAt: slot.endAt,
          mode: mode || slot.mode,
          status: APPOINTMENT_STATUS.PENDING,
          intake,
        }], { session });
        appointment = apptDoc[0];

        await Slot.updateOne({ _id: slot._id }, { $set: { appointment: appointment._id } }, { session });
      });
      await session.endSession();

      // side effects (outside tx)
      await afterBook(appointment).catch((e) => logger.error('after-book err', e));
      return appointment;
    } catch (e) {
      await session.endSession();
      throw e;
    }
  } finally {
    if (lock) await lock.release().catch(() => {});
  }
}

async function afterBook(appointment) {
  const user = await User.findById(appointment.user);
  const therapist = await Therapist.findById(appointment.therapist).populate('user', 'name');
  await Notification.create({
    user: appointment.user,
    type: 'booking_confirmed',
    title: 'Booking received',
    body: `Your session is scheduled for ${appointment.startAt.toISOString()}`,
    link: `/dashboard/appointments/${appointment._id}`,
  });
  if (user?.email) {
    await sendEmail({
      to: user.email,
      ...templates.bookingConfirmed({
        therapistName: therapist?.user?.name || 'Srishti Roy',
        startAt: appointment.startAt.toString(),
        bookingCode: appointment.bookingCode,
        mode: appointment.mode,
        meetingUrl: appointment.meeting?.url,
      }),
    });
  }
}

export async function cancelAppointment({ appointmentId, byUserId, reason }) {
  let lock;
  const appt = await Appointment.findById(appointmentId);
  if (!appt) throw new ApiError(404, 'Appointment not found');
  if ([APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.COMPLETED].includes(appt.status))
    throw new ApiError(400, `Cannot cancel ${appt.status} appointment`);

  try {
    lock = await redlock.acquire([lockKey(appt.slot.toString())], 5000);
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const tCancel = new Date();
        const hoursToStart = (appt.startAt - tCancel) / 3_600_000;
        const refundEligible = hoursToStart >= 24;
        appt.status = APPOINTMENT_STATUS.CANCELLED;
        appt.cancellation = { at: tCancel, by: byUserId, reason, refundEligible };
        await appt.save({ session });
        await Slot.updateOne(
          { _id: appt.slot },
          { $set: { status: SlotStatus.AVAILABLE, appointment: null, heldBy: null, heldUntil: null }, $inc: { version: 1 } },
          { session },
        );
      });
    } finally { await session.endSession(); }
  } finally { if (lock) await lock.release().catch(() => {}); }

  // notify (outside tx)
  const user = await User.findById(appt.user);
  if (user?.email)
    await sendEmail({ to: user.email, ...templates.bookingCancelled({ bookingCode: appt.bookingCode, startAt: appt.startAt.toString() }) });
  return appt;
}

export async function rescheduleAppointment({ appointmentId, newSlotId, userId }) {
  const appt = await Appointment.findById(appointmentId);
  if (!appt) throw new ApiError(404, 'Appointment not found');
  if (appt.user.toString() !== userId.toString()) throw new ApiError(403, 'Not your appointment');
  if ([APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.COMPLETED].includes(appt.status))
    throw new ApiError(400, 'Cannot reschedule this appointment');

  const oldSlotId = appt.slot;
  let lock;
  try {
    lock = await redlock.acquire([lockKey(newSlotId), lockKey(oldSlotId.toString())], 6000);
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        // claim new slot
        const newSlot = await Slot.findOneAndUpdate(
          { _id: newSlotId, status: SlotStatus.AVAILABLE },
          { $set: { status: SlotStatus.BOOKED, appointment: appt._id }, $inc: { version: 1 } },
          { new: true, session },
        );
        if (!newSlot) throw new ApiError(409, 'New slot not available');
        // free old slot
        await Slot.updateOne(
          { _id: oldSlotId },
          { $set: { status: SlotStatus.AVAILABLE, appointment: null }, $inc: { version: 1 } },
          { session },
        );
        appt.reschedule = { previousSlot: oldSlotId, at: new Date() };
        appt.slot = newSlot._id;
        appt.startAt = newSlot.startAt;
        appt.endAt = newSlot.endAt;
        appt.status = APPOINTMENT_STATUS.CONFIRMED;
        await appt.save({ session });
      });
    } finally { await session.endSession(); }
  } finally { if (lock) await lock.release().catch(() => {}); }

  return appt;
}

export async function adminBlockSlot({ slotId }) {
  const slot = await Slot.findById(slotId);
  if (!slot) throw new ApiError(404, 'Slot not found');
  if (slot.status === SlotStatus.BOOKED) throw new ApiError(400, 'Cannot block booked slot');
  slot.status = SlotStatus.BLOCKED;
  await slot.save();
  return slot;
}

export async function adminUnblockSlot({ slotId }) {
  const slot = await Slot.findById(slotId);
  if (!slot) throw new ApiError(404, 'Slot not found');
  if (slot.status !== SlotStatus.BLOCKED) throw new ApiError(400, 'Slot is not blocked');
  slot.status = SlotStatus.AVAILABLE;
  await slot.save();
  return slot;
} 
export const toggleSlotBlock=async({
  slotId,
})=>{

  const slot=await Slot.findById(slotId);

  if(!slot){
    throw new ApiError(
      404,
      'Slot not found'
    );
  }

  if(slot.status==='booked'){
    throw new ApiError(
      400,
      'Booked slot cannot be blocked'
    );
  }

  slot.status=
    slot.status==='blocked'
      ?SlotStatus.AVAILABLE
      :SlotStatus.BLOCKED;

  await slot.save();

  return slot;
};

/**
 * Sweeper: reclaim expired holds back to AVAILABLE. Run by cron / setInterval.
 */
export async function sweepExpiredHolds() {
  const now = new Date();
  const res = await Slot.updateMany(
    { status: SlotStatus.HELD, heldUntil: { $lt: now } },
    { $set: { status: SlotStatus.AVAILABLE, heldBy: null, heldUntil: null }, $inc: { version: 1 } },
  );
  if (res.modifiedCount) logger.info(`Released ${res.modifiedCount} expired holds`);
  return res.modifiedCount;
}
