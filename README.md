# Srishti Roy Counselling — Therapy Booking Platform

A full-stack therapy/counselling booking platform.

- **Frontend:** Next.js (App Router), Tailwind CSS, Zustand
- **Backend:** Node.js, Express, MongoDB (Mongoose), Redis
- **Payments:** Razorpay
- **Email:** Nodemailer (SMTP)
- **Rich text / CMS:** Jodit editor (blogs, service descriptions)

---

## 1. Project structure

```
z/
├── frontend/          Next.js app (marketing site + client dashboard + admin panel)
│   └── src/
│       ├── app/            routes: (marketing), (auth), dashboard, admin
│       ├── components/     marketing/, admin/, auth/, ui/
│       ├── lib/             api.ts (typed API client), utils.ts, seo.ts
│       └── store/           auth.store.ts, booking.store.ts (Zustand)
│
└── backend/           Express API
    └── src/
        ├── controllers/     auth, public, booking, admin
        ├── services/        auth, booking, slot, payment, razorpay, email, token
        ├── models/          User, Therapist, Service, Slot, Appointment, index.js (Blog/Testimonial/Faq/Settings/Transaction/AuditLog/ContactMessage)
        ├── middlewares/      auth, upload (image/file), rateLimit, validate, error
        ├── routes/           auth, public, booking, admin, payment
        └── jobs/             cron.js (slot-hold sweeper + 24h/12h reminders)
```

---

## 2. Setup

Both `frontend/` and `backend/` already have their `.env` files filled in for this
deployment. Node modules are **not** included — install before running:

```bash
cd backend && npm install
cd frontend && npm install
```

### Backend

```bash
cd backend
npm run seed   # optional — seeds therapist/services demo data
npm run dev    # nodemon, http://localhost:4129
```

### Frontend

```bash
cd frontend
npm run dev    # http://localhost:3000
```

---

## 3. Environment variables

### `backend/.env`

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` | Redis (slot holds, refresh tokens) |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Auth tokens |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `EMAIL_FROM` | Outgoing email |
| `ADMIN_EMAIL` | Where admin notification emails are sent (new bookings, contact form, forms uploaded, payment failures) |
| `BACKEND_PUBLIC_URL` | Publicly reachable base URL of **this** backend — used to build absolute image URLs (e.g. logo) inside outgoing emails, since uploaded files are stored as relative `/uploads/...` paths |
| `CLIENT_URL` | Frontend site URL — used in email links and CORS |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID — required for "Sign in / up with Google" (**must be set**, see §5) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Payments |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | Global API rate limit (slot-check endpoints are exempted — see changelog) |

### `frontend/.env`

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base, e.g. `https://api.example.com/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | This site's public URL |
| `NEXT_PUBLIC_THERAPIST_ID` | Default therapist id used on the booking page |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Must match backend's `GOOGLE_CLIENT_ID` exactly |

---

## 4. Feature overview

### Public site
- Home (hero, services, therapist, testimonials) — hero images & logo are **admin-editable** (see §5)
- Services listing + `/services/[slug]` detail pages — content, images, price, duration fully CMS-driven
- Blog listing + detail (Jodit rich-text content)
- Therapist profile, About, Contact (contact form emails the admin)
- Booking flow: slot selection → hold → Razorpay payment → confirmation
- Client dashboard: appointment list, appointment detail (upload intake/consent forms, cancel, reschedule)

### Auth
- Email/password register, login, forgot/reset password, email verification
- **Google Sign-in/Sign-up** (Google Identity Services button — login page, register page, and the in-page auth modal)

### Admin panel (`/admin`)
- Dashboard, Users (full profile + appointment history view), Therapists
- Services — CRUD **with image upload** and a Jodit rich-text description editor
- Appointments — full detail view (client info, intake, payment, meeting link, cancellation info), status transitions (confirm / reject / complete / no-show) with client emails, admin-editable notes/meeting link
- Consent form review — approve or reject an uploaded consent form; rejection asks the client to re-upload and emails them why
- Slots — generate from weekly availability, **block/unblock**
- Blogs (Jodit editor + cover image), Testimonials, FAQs, SEO metadata
- Settings — generic key/value store **plus** a dedicated "Logo & Homepage Hero" panel for uploading the site logo and hero slide images/text without touching code
- Contact messages inbox

### Emails (all branded via the shared HTML template, pulling logo/contact details from Settings)
- Client: email verification, password reset, booking confirmed, booking cancelled, booking rejected, booking completed, payment failed, consent approved, consent rejected (re-upload requested), 24h & 12h session reminders
- Admin: new booking, payment failed, new contact-form message, intake form uploaded, consent form uploaded (needs approval), consent form **re-uploaded after rejection**

---

## 5. Post-deploy checklist

1. **Google Sign-in** — create an OAuth 2.0 Client ID (type: Web application) in Google
   Cloud Console, add your frontend domain(s) under "Authorized JavaScript origins",
   then set the same value in both `backend/.env` (`GOOGLE_CLIENT_ID`) and
   `frontend/.env` (`NEXT_PUBLIC_GOOGLE_CLIENT_ID`). The button auto-hides on the
   frontend until this is configured.
2. **Logo & hero images** — Admin → Settings → Brand tab → "Logo & Homepage Hero".
   Upload the logo and up to two hero slide images/captions; changes go live
   immediately, no deploy needed.
3. **Email branding** — Admin → Settings → add `brand.name`, `brand.contactEmail`,
   `brand.contactPhone`, `brand.address`, `brand.color` (group `brand`) to customise
   outgoing email branding/footer. Falls back to sensible defaults if left unset.
4. Set `ADMIN_EMAIL` and `BACKEND_PUBLIC_URL` in `backend/.env`.
5. `npm install` in both `frontend/` and `backend/` (not included in this delivery).

---

## 6. Changelog — this update

- **Auth:** Added Google Sign-in/Sign-up (`POST /auth/google`, GIS button component wired into login, register, and the auth modal). New `User.googleId` / `authProvider` fields; existing email accounts auto-link on first Google sign-in.
- **Branding:** Site logo and homepage hero slides are now backend/admin driven (`Settings`, group `brand`) instead of hardcoded images.
- **Services:** Admin can now upload a cover image and write the description with the Jodit rich-text editor (previously a plain textarea); public service pages render it as HTML.
- **Appointments (admin):** Full detail view — intake, payment, meeting link, cancellation info; Confirm/Reject/Complete/No-show now actually persist (previously the Confirm button only changed local UI state and didn't call the API); consent form approve/reject workflow with client email + re-upload flow; admin can edit meeting link and notes.
- **Users (admin):** "View" now opens full profile + appointment/transaction history (`GET /admin/users/:id`).
- **Slots:** Fixed missing "Unblock" button (block/unblock toggle endpoint existed but the UI never showed it); admin slot routes are now properly auth-protected (were previously public).
- **Uploads (client dashboard → appointment detail):** Fixed intake/consent upload — was silently failing (JSON body sent instead of multipart, wrong field name, and the backend was comparing the wrong values). Added `Transaction.consentForm` field so the consent file is tracked separately from `intakeForm`. Preview/"View file" links added; rejected consent forms show the reason and allow re-upload.
- **Emails:** Full redesign — one shared branded HTML layout (logo, accent colour, footer with contact details, all pulled from `Settings`) used by every template; added `bookingRejected`, `bookingCompleted`, `bookingFailed`, `reminder12h`, `consentApproved`, `consentRejected`, `adminNewBooking`, `adminPaymentFailed`, `adminContactMessage`, `adminIntakeFormUploaded`, `adminConsentFormUploaded`, `adminConsentReuploaded`. Also fixed: booking-confirmed email was never actually sent (the call was commented out), blog creation crashed on save (missing `slugify` import), contact form didn't notify the admin.
- **Reminders:** Added a 12-hour-before reminder job alongside the existing 24-hour one.
- **Rate limiting:** Slot availability checking (`/bookings/slots`, `/bookings/check-slot`, `/bookings/admin/slots`) is now exempt from the global API rate limiter, since the calendar UI polls it frequently.