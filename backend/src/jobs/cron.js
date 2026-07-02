import { sweepExpiredHolds } from '../services/booking.service.js';
import logger from '../utils/logger.js';
import Appointment, { APPOINTMENT_STATUS } from '../models/Appointment.js';
import User from '../models/User.js';
import { sendEmail } from '../services/email.service.js';

// Periodic tasks. Run from server.js or external scheduler.
export function startCronJobs() {
  setInterval(() => sweepExpiredHolds().catch((e) => logger.error('sweep err', e)), 30_000);
  setInterval(() => remindUpcoming(24, 25, 'tMinus24h', 'reminder24h').catch((e) => logger.error('remind24 err', e)), 5 * 60_000);
  setInterval(() => remindUpcoming(12, 13, 'tMinus12h', 'reminder12h').catch((e) => logger.error('remind12 err', e)), 5 * 60_000);
}

async function remindUpcoming(hoursFrom, hoursTo, sentFlag, templateName) {
  const now = new Date();
  const from = new Date(now.getTime() + hoursFrom * 3_600_000);
  const to = new Date(now.getTime() + hoursTo * 3_600_000);
  const due = await Appointment.find({
    status: APPOINTMENT_STATUS.CONFIRMED,
    startAt: { $gte: from, $lte: to },
    [`remindersSent.${sentFlag}`]: { $ne: true },
  }).populate('user', 'name email');
  for (const a of due) {
    if (a.user?.email) {
      await sendEmail({
        to: a.user.email,
        ...templates[templateName]({ name: a.user.name, startAt: a.startAt.toString(), bookingCode: a.bookingCode }),
      }).catch(() => {});
    }
    a.remindersSent = a.remindersSent || {};
    a.remindersSent[sentFlag] = true;
    await a.save();
  }
}
