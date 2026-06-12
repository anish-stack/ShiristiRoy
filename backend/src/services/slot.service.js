import { Availability, BlockedDate, Slot, SlotStatus } from '../models/Slot.js';
import Therapist from '../models/Therapist.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Generate slots for given therapist between [from, to] based on weekly availability,
 * skipping blocked windows. Idempotent due to unique index (therapist, startAt).
 */
export async function generateSlots({ therapistId, from, to }) {
  const therapist = await Therapist.findById(therapistId);
  if (!therapist) throw new ApiError(404, 'Therapist not found');

  const availability = await Availability.find({ therapist: therapistId, isActive: true });
  const blocks = await BlockedDate.find({
    therapist: therapistId,
    startAt: { $lte: to }, endAt: { $gte: from },
  });

  const ops = [];
  const cur = new Date(from);
  cur.setHours(0, 0, 0, 0);
  const end = new Date(to);

  while (cur <= end) {
    const dow = cur.getDay();
    const dayRules = availability.filter((a) => a.dayOfWeek === dow);
    for (const rule of dayRules) {
      const [sh, sm] = rule.startTime.split(':').map(Number);
      const [eh, em] = rule.endTime.split(':').map(Number);
      const dayStart = new Date(cur); dayStart.setHours(sh, sm, 0, 0);
      const dayEnd = new Date(cur); dayEnd.setHours(eh, em, 0, 0);
      const step = (rule.slotDurationMin + rule.bufferMin) * 60_000;
      for (let t = dayStart.getTime(); t + rule.slotDurationMin * 60_000 <= dayEnd.getTime(); t += step) {
        const startAt = new Date(t);
        const endAt = new Date(t + rule.slotDurationMin * 60_000);
        const isBlocked = blocks.some((b) => startAt < b.endAt && endAt > b.startAt);
        if (isBlocked) continue;
        ops.push({
          updateOne: {
            filter: { therapist: therapistId, startAt },
            update: {
              $setOnInsert: {
                therapist: therapistId, startAt, endAt,
                durationMin: rule.slotDurationMin,
                mode: rule.mode === 'both' ? 'online' : rule.mode,
                status: SlotStatus.AVAILABLE, version: 0,
              },
            },
            upsert: true,
          },
        });
      }
    }
    cur.setDate(cur.getDate() + 1);
  }
  if (ops.length) await Slot.bulkWrite(ops, { ordered: false });
  return { created: ops.length };
}

export async function listAvailableSlots({ therapistId, from, to, mode, service }) {
  const q = {
    therapist: therapistId,
    startAt: { $gte: from, $lte: to },
    status: SlotStatus.AVAILABLE,
  };
  if (mode) q.mode = mode;
  // if (service) q.service = service;
  // also exclude held but expired? a separate sweeper handles that.
  return Slot.find(q).sort({ startAt: 1 }).lean();
}

export async function checkSelectedSlot({ slotId, therapistId, service }) {
  const slot = await Slot.findOne({ _id: slotId, therapist: therapistId, status: SlotStatus.AVAILABLE , });
  console.log('Checking slot with criteria:', { slotId, therapistId, service });
  console.log('Found slot:', slot);
  if (!slot) throw new ApiError(400, 'Selected slot is no t available');
  // if (
  //   service &&
  //   slot.service &&
  //   slot.service.toString() !== service.toString()
  // ) {
  //   throw new ApiError(
  //     400,
  //     `Selected slot does not support service ${service}`
  //   );
  // }
  return slot;
}