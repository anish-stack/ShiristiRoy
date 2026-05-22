import { sweepExpiredHolds } from '../services/booking.service.js';
import logger from '../utils/logger.js';
import Appointment, { APPOINTMENT_STATUS } from '../models/Appointment.js';
import User from '../models/User.js';
import { sendEmail } from '../services/email.service.js';

// Periodic tasks. Run from server.js or external scheduler.
export function startCronJobs() {
  setInterval(() => sweepExpiredHolds().catch((e) => logger.error('sweep err', e)), 30_000);
  setInterval(() => remindUpcoming().catch((e) => logger.error('remind err', e)), 5 * 60_000);
}

async function remindUpcoming() {
  const now = new Date();
  const in24 = new Date(now.getTime() + 24 * 3_600_000);
  const in25 = new Date(now.getTime() + 25 * 3_600_000);
  const due = await Appointment.find({
    status: APPOINTMENT_STATUS.CONFIRMED,
    startAt: { $gte: in24, $lte: in25 },
    'remindersSent.tMinus24h': { $ne: true },
  }).populate('user', 'name email');
  for (const a of due) {
    if (a.user?.email) {
      await sendEmail({
        to: a.user.email,
        subject: 'Reminder: your session is in 24 hours',
        html: `<p>Hi ${a.user.name}, this is a reminder for your session on ${a.startAt.toString()}.</p>`,
      }).catch(() => {});
    }
    a.remindersSent.tMinus24h = true;
    await a.save();
  }
}
