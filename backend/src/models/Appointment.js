import mongoose from 'mongoose';

export const APPOINTMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
  RESCHEDULED: 'rescheduled',
});

const appointmentSchema = new mongoose.Schema({
  bookingCode: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true, index: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true, unique: true },
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  mode: { type: String, enum: ['online', 'in_person'] },
  status: { type: String, enum: Object.values(APPOINTMENT_STATUS), default: APPOINTMENT_STATUS.PENDING, index: true },
  intake: {
    primaryConcern: String,
    prevTherapy: Boolean,
    notes: String,
    emergencyContact: { name: String, phone: String, relation: String },
  },
  meeting: { url: String, provider: { type: String, default: 'zoom' } },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  cancellation: { at: Date, by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, reason: String, refundEligible: Boolean },
  reschedule: { previousSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot' }, at: Date },
  remindersSent: { tMinus24h: Boolean, tMinus12h: Boolean, tMinus1h: Boolean },
}, { timestamps: true });

appointmentSchema.index({ user: 1, status: 1, startAt: -1 });
appointmentSchema.index({ therapist: 1, startAt: 1 });

export default mongoose.model('Appointment', appointmentSchema);
