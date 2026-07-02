import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';
import { Settings } from '../models/index.js';

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
      from: process.env.EMAIL_FROM, to, subject, html,
      text: text || stripHtml(html),
    });
    logger.info(`Email sent ${info.messageId} -> ${to}`);
    return info;
  } catch (e) { logger.error('Email send failed', e); throw e; }
}

// ── Brand / contact details (pulled from Settings, cached in memory) ────────
// Templates below must stay synchronous (callers do `...templates.x(data)`
// without awaiting), so we keep a small cache that's refreshed in the
// background from the admin-configurable Settings collection (group:
// 'brand'), with sensible env-based fallbacks until the first refresh lands.

const BACKEND_ORIGIN = (process.env.BACKEND_PUBLIC_URL || '').replace(/\/$/, '');
const SITE_URL = (process.env.CLIENT_URL || '').replace(/\/$/, '');

let brand = {
  name: 'Srishti Roy Counselling',
  logoUrl: '',
  color: '#7C6AA8',
  contactEmail: (process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1]) || process.env.SMTP_USER || '',
  contactPhone: '',
  address: '',
  siteUrl: SITE_URL,
};

function resolveAssetUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return BACKEND_ORIGIN ? `${BACKEND_ORIGIN}${url}` : '';
}

async function refreshBrandCache() {
  try {
    const rows = await Settings.find({ group: 'brand' }).lean();
    const byKey = {};
    for (const r of rows) byKey[r.key] = r.value;

    brand = {
      name: byKey['brand.name'] || brand.name,
      logoUrl: resolveAssetUrl(byKey['brand.logo']?.url) || brand.logoUrl,
      color: byKey['brand.color'] || brand.color,
      contactEmail: byKey['brand.contactEmail'] || brand.contactEmail,
      contactPhone: byKey['brand.contactPhone'] || brand.contactPhone,
      address: byKey['brand.address'] || brand.address,
      siteUrl: byKey['brand.siteUrl'] || brand.siteUrl,
    };
  } catch (e) {
    logger.error('Failed to refresh brand settings for emails', e);
  }
}

// Best-effort initial load + periodic refresh — never blocks email sending.
refreshBrandCache();
setInterval(refreshBrandCache, 10 * 60_000).unref?.();

function stripHtml(html = '') {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ── Shared layout ────────────────────────────────────────────────────────
// One clean, table-based (email-client-safe) wrapper used by every template.
// `preheader` is the short hidden preview text shown in inbox lists.
function layout({ preheader = '', heading, bodyHtml, cta, accent }) {
  const color = accent || brand.color;
  const logo = brand.logoUrl
    ? `<img src="${esc(brand.logoUrl)}" alt="${esc(brand.name)}" height="40" style="height:40px;width:auto;display:block;border:0;outline:none;text-decoration:none;" />`
    : `<span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:600;color:#ffffff;letter-spacing:.02em;">${esc(brand.name)}</span>`;

  const ctaBlock = cta?.url && cta?.text ? `
    <tr>
      <td style="padding:28px 40px 4px;" align="center">
        <a href="${esc(cta.url)}" target="_blank"
           style="display:inline-block;background:${color};color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;padding:13px 32px;border-radius:999px;">
          ${esc(cta.text)}
        </a>
      </td>
    </tr>` : '';

  const contactBits = [
    brand.contactEmail ? `<a href="mailto:${esc(brand.contactEmail)}" style="color:#9B7AD9;text-decoration:none;">${esc(brand.contactEmail)}</a>` : '',
    brand.contactPhone ? esc(brand.contactPhone) : '',
  ].filter(Boolean).join('&nbsp;&nbsp;·&nbsp;&nbsp;');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(heading || brand.name)}</title>
</head>
<body style="margin:0;padding:0;background:#F3F0F8;font-family:Arial,Helvetica,sans-serif;">
  <span style="display:none;font-size:1px;color:#F3F0F8;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${esc(preheader)}</span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F0F8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(28,22,41,0.06);">

          <!-- header -->
          <tr>
            <td style="background:#1C1629;padding:26px 40px;" align="left">
              ${logo}
            </td>
          </tr>

          <!-- accent rule -->
          <tr><td style="height:4px;background:${color};line-height:0;font-size:0;">&nbsp;</td></tr>

          <!-- heading -->
          ${heading ? `
          <tr>
            <td style="padding:32px 40px 4px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-weight:500;font-size:22px;color:#1C1629;">${esc(heading)}</h1>
            </td>
          </tr>` : ''}

          <!-- body -->
          <tr>
            <td style="padding:12px 40px 8px;font-family:Arial,Helvetica,sans-serif;font-size:14.5px;line-height:1.7;color:#4A4458;">
              ${bodyHtml}
            </td>
          </tr>

          ${ctaBlock}

          <tr><td style="padding:28px 40px 0;"><div style="border-top:1px solid #EDE8F8;"></div></td></tr>

          <!-- footer -->
          <tr>
            <td style="padding:20px 40px 32px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;color:#9B93AC;" align="center">
              <p style="margin:0 0 4px;font-weight:600;color:#4A4458;">${esc(brand.name)}</p>
              ${brand.address ? `<p style="margin:0 0 4px;">${esc(brand.address)}</p>` : ''}
              ${contactBits ? `<p style="margin:0 0 10px;">${contactBits}</p>` : ''}
              ${brand.siteUrl ? `<p style="margin:0;"><a href="${esc(brand.siteUrl)}" style="color:#9B93AC;text-decoration:underline;">${esc(brand.siteUrl.replace(/^https?:\/\//, ''))}</a></p>` : ''}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Small reusable "fact row" used inside several templates (booking code,
// date, time, etc.) — keeps things visually consistent.
function factRow(label, value) {
  if (value === undefined || value === null || value === '') return '';
  return `
    <tr>
      <td style="padding:6px 0;color:#9B93AC;font-size:13px;width:120px;vertical-align:top;">${esc(label)}</td>
      <td style="padding:6px 0;color:#1C1629;font-size:13px;font-weight:600;vertical-align:top;">${value}</td>
    </tr>`;
}
function factTable(rows) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:14px 0 6px;">${rows.join('')}</table>`;
}
function calloutBox(html, tone = 'neutral') {
  const bg = { neutral: '#F8F6FC', warn: '#FDF3E9', danger: '#FDEEEE', success: '#EEF8F1' }[tone] || '#F8F6FC';
  const border = { neutral: '#E9E2F5', warn: '#F3DEC0', danger: '#F5CFCF', success: '#CFEBD8' }[tone] || '#E9E2F5';
  return `<div style="background:${bg};border:1px solid ${border};border-radius:12px;padding:14px 16px;margin:14px 0;">${html}</div>`;
}

export const templates = {
  verify: (link) => ({
    subject: `Verify your email — ${brand.name}`,
    html: layout({
      preheader: 'Confirm your email address to get started.',
      heading: 'Verify your email',
      bodyHtml: `
        <p>Hi,</p>
        <p>Thanks for signing up. Please confirm this is your email address — the link below expires in 1 hour.</p>`,
      cta: { text: 'Verify email address', url: link },
    }),
  }),

  reset: (link) => ({
    subject: 'Reset your password',
    html: layout({
      preheader: 'Reset your password — link valid for 30 minutes.',
      heading: 'Reset your password',
      bodyHtml: `
        <p>We received a request to reset your password. This link is valid for 30 minutes.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>`,
      cta: { text: 'Reset password', url: link },
    }),
  }),

  bookingConfirmed: (data) => ({
    subject: `Appointment confirmed — ${data.bookingCode}`,
    html: layout({
      preheader: `Your session with ${data.therapistName} is confirmed.`,
      heading: 'Your session is booked',
      accent: '#6FA37C',
      bodyHtml: `
        <p>Good news — your appointment has been confirmed.</p>
        ${factTable([
          factRow('Therapist', esc(data.therapistName)),
          factRow('When', esc(data.startAt)),
          factRow('Mode', esc(data.mode)),
          factRow('Booking code', `<span style="font-family:monospace;">${esc(data.bookingCode)}</span>`),
        ])}
        <p style="margin-top:16px;">Please make sure any required intake/consent forms are uploaded from your dashboard before the session.</p>`,
      cta: data.meetingUrl ? { text: 'Join session link', url: data.meetingUrl } : undefined,
    }),
  }),

  bookingCancelled: (data) => ({
    subject: `Appointment cancelled — ${data.bookingCode}`,
    html: layout({
      preheader: `Booking ${data.bookingCode} has been cancelled.`,
      heading: 'Appointment cancelled',
      accent: '#C9736B',
      bodyHtml: `
        <p>Your appointment scheduled for <b>${esc(data.startAt)}</b> has been cancelled.</p>
        ${factTable([factRow('Booking code', `<span style="font-family:monospace;">${esc(data.bookingCode)}</span>`)])}
        <p>You're welcome to book another session anytime from your dashboard.</p>`,
    }),
  }),

  bookingRejected: (data) => ({
    subject: `Update on your booking — ${data.bookingCode}`,
    html: layout({
      preheader: 'We were unable to confirm your recent booking.',
      heading: "We're sorry",
      accent: '#C9736B',
      bodyHtml: `
        <p>Your booking for <b>${esc(data.startAt)}</b> could not be confirmed.</p>
        ${data.reason ? calloutBox(`<span style="color:#8A4A44;">Reason: ${esc(data.reason)}</span>`, 'danger') : ''}
        ${factTable([factRow('Booking code', `<span style="font-family:monospace;">${esc(data.bookingCode)}</span>`)])}
        <p>Any amount paid will be refunded or adjusted. Please get in touch or choose another available slot.</p>`,
    }),
  }),

  bookingCompleted: (data) => ({
    subject: `Thank you for your session — ${data.bookingCode}`,
    html: layout({
      preheader: 'Thank you for attending your session.',
      heading: 'Thank you for coming in',
      accent: '#6F9BC9',
      bodyHtml: `
        <p>Thank you for attending your session with <b>${esc(data.therapistName)}</b>. We hope it was helpful.</p>
        ${factTable([factRow('Booking code', `<span style="font-family:monospace;">${esc(data.bookingCode)}</span>`)])}
        <p>Take care, and we look forward to supporting you again whenever you're ready.</p>`,
    }),
  }),

  bookingFailed: (data) => ({
    subject: 'Payment failed for your booking attempt',
    html: layout({
      preheader: 'Your recent payment attempt was unsuccessful.',
      heading: 'Payment unsuccessful',
      accent: '#C9736B',
      bodyHtml: `
        <p>Your payment could not be completed${data.reason ? ` (${esc(data.reason)})` : ''}.</p>
        <p>The slot you selected has been released. Please feel free to try booking again.</p>`,
      cta: brand.siteUrl ? { text: 'Try booking again', url: brand.siteUrl } : undefined,
    }),
  }),

  reminder24h: (data) => ({
    subject: 'Reminder: your session is tomorrow',
    html: layout({
      preheader: `Your session is coming up on ${data.startAt}.`,
      heading: 'See you tomorrow',
      bodyHtml: `
        <p>Hi ${esc(data.name)}, just a friendly reminder about your upcoming session.</p>
        ${factTable([
          factRow('When', `${esc(data.startAt)} <span style="color:#9B93AC;font-weight:400;">(in about 24 hours)</span>`),
          factRow('Booking code', `<span style="font-family:monospace;">${esc(data.bookingCode)}</span>`),
        ])}`,
    }),
  }),

  reminder12h: (data) => ({
    subject: 'Reminder: your session is in 12 hours',
    html: layout({
      preheader: `Your session is coming up on ${data.startAt}.`,
      heading: 'Almost time for your session',
      bodyHtml: `
        <p>Hi ${esc(data.name)}, your session is coming up soon.</p>
        ${factTable([
          factRow('When', `${esc(data.startAt)} <span style="color:#9B93AC;font-weight:400;">(in about 12 hours)</span>`),
          factRow('Booking code', `<span style="font-family:monospace;">${esc(data.bookingCode)}</span>`),
        ])}
        <p>Please make sure any pending forms are uploaded before we begin.</p>`,
    }),
  }),

  consentApproved: (data) => ({
    subject: `Consent form approved — ${data.bookingCode}`,
    html: layout({
      preheader: 'Your consent form has been approved.',
      heading: 'Consent form approved',
      accent: '#6FA37C',
      bodyHtml: `
        <p>Your consent form has been reviewed and approved. Your booking is on track.</p>
        ${factTable([factRow('Booking code', `<span style="font-family:monospace;">${esc(data.bookingCode)}</span>`)])}`,
    }),
  }),

  consentRejected: (data) => ({
    subject: `Action needed: consent form — ${data.bookingCode}`,
    html: layout({
      preheader: 'Your consent form needs a quick re-upload.',
      heading: 'Consent form needs attention',
      accent: '#D9A441',
      bodyHtml: `
        <p>Your consent form for booking <b>${esc(data.bookingCode)}</b> wasn't accepted.</p>
        ${calloutBox(`<span style="color:#8A6A24;">Reason: ${esc(data.reason)}</span>`, 'warn')}
        <p>Please log in to your dashboard and re-upload the form at your earliest convenience.</p>`,
      cta: brand.siteUrl ? { text: 'Go to dashboard', url: `${brand.siteUrl}/dashboard` } : undefined,
    }),
  }),

  adminNewBooking: (data) => ({
    subject: `New booking — ${data.bookingCode}`,
    html: layout({
      preheader: `New appointment from ${data.userName}.`,
      heading: 'New booking received',
      bodyHtml: `
        ${factTable([
          factRow('Client', `${esc(data.userName)} <span style="color:#9B93AC;font-weight:400;">(${esc(data.userEmail)})</span>`),
          factRow('Therapist', esc(data.therapistName)),
          factRow('Service', esc(data.serviceName || 'General session')),
          factRow('When', esc(data.startAt)),
          factRow('Booking code', `<span style="font-family:monospace;">${esc(data.bookingCode)}</span>`),
        ])}`,
    }),
  }),

  adminPaymentFailed: (data) => ({
    subject: `Payment failed — ${data.userEmail}`,
    html: layout({
      preheader: 'A client payment attempt failed.',
      heading: 'Payment attempt failed',
      accent: '#C9736B',
      bodyHtml: `<p>A payment attempt failed for <b>${esc(data.userEmail)}</b>${data.reason ? ` — ${esc(data.reason)}` : ''}.</p>`,
    }),
  }),

  adminContactMessage: (data) => ({
    subject: `New contact form message: ${data.subject || 'General enquiry'}`,
    html: layout({
      preheader: `New message from ${data.name}.`,
      heading: 'New contact form message',
      bodyHtml: `
        ${factTable([
          factRow('From', `${esc(data.name)} <span style="color:#9B93AC;font-weight:400;">(${esc(data.email)}${data.phone ? `, ${esc(data.phone)}` : ''})</span>`),
        ])}
        ${calloutBox(`<p style="margin:0;white-space:pre-wrap;">${esc(data.message || '').replace(/\n/g, '<br/>')}</p>`)}`,
    }),
  }),

  adminIntakeFormUploaded: (data) => ({
    subject: `Intake form uploaded — ${data.bookingCode}`,
    html: layout({
      preheader: `${data.userName} uploaded their intake form.`,
      heading: 'Intake form uploaded — review needed',
      accent: '#6F9BC9',
      bodyHtml: `
        <p><b>${esc(data.userName)}</b> (${esc(data.userEmail)}) just uploaded their intake form.</p>
        ${factTable([
          factRow('Booking code', `<span style="font-family:monospace;">${esc(data.bookingCode)}</span>`),
          factRow('Session', esc(data.startAt)),
        ])}
        <p>Open the appointment in the admin panel to view the file.</p>`,
      cta: data.reviewUrl ? { text: 'Review appointment', url: data.reviewUrl } : undefined,
    }),
  }),

  adminConsentFormUploaded: (data) => ({
    subject: `Consent form uploaded — ${data.bookingCode}`,
    html: layout({
      preheader: `${data.userName} uploaded their consent form — approval needed.`,
      heading: 'Consent form uploaded — approval needed',
      accent: '#D9A441',
      bodyHtml: `
        <p><b>${esc(data.userName)}</b> (${esc(data.userEmail)}) just uploaded their consent form.</p>
        ${calloutBox('This form is pending your review — please approve or reject it from the admin panel.', 'warn')}
        ${factTable([
          factRow('Booking code', `<span style="font-family:monospace;">${esc(data.bookingCode)}</span>`),
          factRow('Session', esc(data.startAt)),
        ])}`,
      cta: data.reviewUrl ? { text: 'Review consent form', url: data.reviewUrl } : undefined,
    }),
  }),

  adminConsentReuploaded: (data) => ({
    subject: `Consent form re-uploaded after rejection — ${data.bookingCode}`,
    html: layout({
      preheader: `${data.userName} re-uploaded a corrected consent form.`,
      heading: 'Consent form re-uploaded',
      accent: '#D9A441',
      bodyHtml: `
        <p><b>${esc(data.userName)}</b> (${esc(data.userEmail)}) re-uploaded their consent form after your earlier rejection.</p>
        ${data.previousReason ? calloutBox(`<span style="color:#8A6A24;">Your previous rejection reason: ${esc(data.previousReason)}</span>`, 'warn') : ''}
        ${factTable([
          factRow('Booking code', `<span style="font-family:monospace;">${esc(data.bookingCode)}</span>`),
          factRow('Session', esc(data.startAt)),
        ])}
        <p>Please review the new file and approve or reject it again.</p>`,
      cta: data.reviewUrl ? { text: 'Review consent form', url: data.reviewUrl } : undefined,
    }),
  }),
};