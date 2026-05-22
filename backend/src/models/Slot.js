import mongoose from 'mongoose';

// Weekly recurring availability per therapist
const availabilitySchema = new mongoose.Schema({
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true, index: true },
  dayOfWeek: { type: Number, min: 0, max: 6, required: true }, // 0=Sun..6=Sat
  startTime: { type: String, required: true }, // "09:00" 24h
  endTime: { type: String, required: true },   // "17:00"
  slotDurationMin: { type: Number, default: 50 },
  bufferMin: { type: Number, default: 10 },
  mode: { type: String, enum: ['online', 'in_person', 'both'], default: 'online' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
availabilitySchema.index({ therapist: 1, dayOfWeek: 1 });

// Block / leave window (overrides availability)
const blockedDateSchema = new mongoose.Schema({
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true, index: true },
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  reason: String,
}, { timestamps: true });
blockedDateSchema.index({ therapist: 1, startAt: 1, endAt: 1 });

// Materialized slot. Source of truth for booking concurrency.
// Unique compound index (therapist, startAt) prevents duplicate slots.
const SLOT_STATUS = Object.freeze({
  AVAILABLE: 'available',
  HELD: 'held',          // temp lock during checkout
  BOOKED: 'booked',
  BLOCKED: 'blocked',
});
const slotSchema = new mongoose.Schema({
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true, index: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  durationMin: { type: Number, required: true },
  mode: { type: String, enum: ['online', 'in_person'], default: 'online' },
  status: { type: String, enum: Object.values(SLOT_STATUS), default: SLOT_STATUS.AVAILABLE, index: true },
  heldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  heldUntil: { type: Date, default: null },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
  version: { type: Number, default: 0 }, // optimistic concurrency
}, { timestamps: true });

// Prevent two slots for same therapist at same start time
slotSchema.index(
  {
    therapist: 1,
    service: 1,
    startAt: 1,
  }
);
  slotSchema.index({ therapist: 1, status: 1, startAt: 1 });

export const SlotStatus = SLOT_STATUS;
export const Availability = mongoose.model('Availability', availabilitySchema);
export const BlockedDate = mongoose.model('BlockedDate', blockedDateSchema);
export const Slot = mongoose.model('Slot', slotSchema);
