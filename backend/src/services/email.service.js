import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

let transporter;
function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  try {
    const info = await getTransporter().sendMail({
      from: process.env.EMAIL_FROM, to, subject, html, text,
    });
    logger.info(`Email sent ${info.messageId} -> ${to}`);
    return info;
  } catch (e) { logger.error('Email send failed', e); throw e; }
}

export const templates = {
  verify: (link) => ({
    subject: 'Verify your email — Srishti Roy Counselling',
    html: `<p>Hi,</p><p>Please verify your email by clicking the link below. It expires in 1 hour.</p>
           <p><a href="${link}">${link}</a></p><p>— Srishti Roy</p>`,
  }),
  reset: (link) => ({
    subject: 'Reset your password',
    html: `<p>You requested a password reset. Link valid 30 minutes.</p><p><a href="${link}">${link}</a></p>`,
  }),
  bookingConfirmed: (data) => ({
    subject: `Appointment confirmed: ${data.startAt}`,
    html: `<h2>Your session is booked</h2>
      <p>With: ${data.therapistName}</p><p>When: ${data.startAt}</p>
      <p>Booking code: <b>${data.bookingCode}</b></p>
      <p>Mode: ${data.mode}</p>${data.meetingUrl ? `<p>Meeting: <a href="${data.meetingUrl}">${data.meetingUrl}</a></p>` : ''}`,
  }),
  bookingCancelled: (data) => ({
    subject: `Appointment cancelled: ${data.bookingCode}`,
    html: `<p>Your appointment on ${data.startAt} has been cancelled.</p>`,
  }),
};
