# Srishti Roy — Therapy Booking Platform

**Enterprise-grade therapy website + booking system**  
Stack: Next.js 14 · Node.js/Express · MongoDB · Redis · Redlock · JWT · Tailwind · Shadcn · Framer Motion

> Brand: Lavender · Sage · Dusty Blue · Warm Ivory  
> Tagline: *Healing through awareness, reflection, and self-understanding.*

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Quick Start](#quick-start)
3. [Environment Variables](#environment-variables)
4. [Database Schemas](#database-schemas)
5. [API Route Reference](#api-route-reference)
6. [Booking Concurrency Strategy](#booking-concurrency-strategy)
7. [Redis Strategy](#redis-strategy)
8. [Deployment Guide](#deployment-guide)
9. [Security Checklist](#security-checklist)
10. [Implementation Phases](#implementation-phases)

---

## Project Structure

```
srishti-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # db.js, redis.js
│   │   ├── models/          # User, Therapist, Slot, Appointment, Blog, ...
│   │   ├── services/        # auth, token, booking, slot, email, payment
│   │   ├── controllers/     # auth, public, booking, admin
│   │   ├── routes/          # auth, public, booking, admin, payment
│   │   ├── middlewares/     # auth (JWT+RBAC), error, rateLimit, validate
│   │   ├── validators/      # Zod schemas
│   │   ├── utils/           # logger, apiError, ms, seed
│   │   ├── jobs/            # cron.js (hold sweeper + reminders)
│   │   ├── docs/            # swagger.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (marketing)/     # about, services, blog, contact, book
│   │   │   ├── (auth)/          # login, register, verify, forgot, reset
│   │   │   ├── dashboard/       # user dashboard, appointments, profile
│   │   │   ├── admin/           # admin CMS: users, appts, blogs, SEO, settings
│   │   │   ├── layout.tsx       # root layout, fonts, Navbar, Footer
│   │   │   ├── page.tsx         # homepage
│   │   │   ├── sitemap.ts
│   │   │   └── robots.ts
│   │   ├── components/
│   │   │   ├── marketing/       # Navbar, Footer, Hero, TestimonialCard ...
│   │   │   ├── booking/         # BookingFlow, SlotPicker, IntakeForm ...
│   │   │   ├── dashboard/       # AppointmentCard, ProfileForm ...
│   │   │   ├── admin/           # AdminSidebar, DataTable, CmsEditor ...
│   │   │   └── ui/              # Toaster, Button, Input, Modal, Skeleton ...
│   │   ├── lib/                 # api.ts, utils.ts, seo.ts
│   │   ├── store/               # auth.store.ts, booking.store.ts (Zustand)
│   │   ├── hooks/               # useAppointments, useSlots, useAuth ...
│   │   └── styles/globals.css
│   ├── .env.local.example
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 20+, Docker (optional), MongoDB 7, Redis 7

### 1. Backend

```bash
cd backend
cp .env.example .env
# Fill in MONGO_URI, REDIS_*, JWT secrets, SMTP, Cloudinary

npm install
npm run seed          # creates admin user, Srishti profile, services, FAQs, SEO data
npm run dev           # :5000
```

Swagger docs at `http://localhost:5000/api-docs`

### 2. Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_THERAPIST_ID (from seed output)

npm install
npm run dev           # :3000
```

### 3. Docker (full stack)

```bash
# Fill backend/.env first
docker-compose up --build
```

---

## Environment Variables

### Backend `.env`

| Key | Purpose |
|-----|---------|
| `MONGO_URI` | MongoDB connection string |
| `REDIS_HOST/PORT/PASSWORD` | Redis connection |
| `JWT_ACCESS_SECRET` | 64+ random chars |
| `JWT_REFRESH_SECRET` | Different 64+ random chars |
| `JWT_ACCESS_EXPIRES_IN` | e.g. `15m` |
| `JWT_REFRESH_EXPIRES_IN` | e.g. `7d` |
| `SMTP_*` | Nodemailer SMTP config |
| `CLOUDINARY_*` | File upload |
| `RAZORPAY_KEY_ID/SECRET` | Payment |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook HMAC |
| `SLOT_LOCK_TTL_MS` | Redis lock TTL (default: 10000) |
| `SLOT_LOCK_RETRY_COUNT` | Redlock retries (default: 3) |
| `CORS_ORIGINS` | Comma-separated allowed origins |

### Frontend `.env.local`

| Key | Purpose |
|-----|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_SITE_URL` | Used for canonical + OG tags |
| `NEXT_PUBLIC_THERAPIST_ID` | Srishti's MongoDB `_id` (from seed) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public Razorpay key |

---

## Database Schemas

### User
`_id · name · email (unique) · passwordHash · role (admin|therapist|user) · phone · avatar · isEmailVerified · isActive · preferredLanguage · meta(dob, gender, timezone) · timestamps`

### Therapist
`_id · user(ref User) · slug(unique) · title · bio · shortBio · specializations[] · approaches[] · languages[] · yearsExperience · certifications[] · consultationFee · defaultSlotDurationMin · bufferMin · timezone · isAcceptingClients · isFeatured · rating · seo · timestamps`

### Availability (weekly template)
`_id · therapist(ref) · dayOfWeek(0-6) · startTime · endTime · slotDurationMin · bufferMin · mode · isActive`

### BlockedDate
`_id · therapist(ref) · startAt · endAt · reason`

### Slot (materialized)
`_id · therapist(ref) · startAt · endAt · durationMin · mode · status(available|held|booked|blocked) · heldBy(ref User) · heldUntil · appointment(ref) · version`  
**Unique index**: `(therapist, startAt)`

### Appointment
`_id · bookingCode(unique) · user(ref) · therapist(ref) · service(ref) · slot(ref, unique) · startAt · endAt · mode · status · intake · meeting · payment(ref) · cancellation · reschedule · remindersSent · timestamps`

### Blog
`_id · slug(unique) · title · excerpt · content · coverImage · author(ref) · tags[] · category · status · publishedAt · seo · views · timestamps`

### Transaction
`_id · user(ref) · appointment(ref) · provider · providerOrderId · providerPaymentId · amount · currency · status · refund · timestamps`

### Others
`Testimonial · Notification · SeoMetadata · Settings (key-value) · ContactMessage · Faq · AuditLog`

---

## API Route Reference

All routes prefixed `/api/v1`

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | - | Register + send verify email |
| POST | `/auth/verify-email` | - | Verify email token |
| POST | `/auth/login` | - | Login → access+refresh tokens |
| POST | `/auth/refresh` | - | Rotate refresh token |
| POST | `/auth/logout` | - | Revoke refresh token |
| POST | `/auth/logout-all` | Bearer | Revoke all sessions |
| POST | `/auth/forgot` | - | Send password reset email |
| POST | `/auth/reset` | - | Set new password |
| GET | `/auth/me` | Bearer | Current user |

### Public
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/therapists` | - | List therapists (filter: spec, lang, q) |
| GET | `/therapists/:slug` | - | Therapist profile |
| PUT | `/therapists/:id/availability` | therapist/admin | Set weekly schedule |
| POST | `/therapists/:id/blocked-dates` | therapist/admin | Add blocked window |
| POST | `/therapists/:id/generate-slots` | therapist/admin | Materialise slots |
| GET | `/services` | - | List services |
| GET | `/services/:slug` | - | Service detail |
| GET | `/blogs` | - | Blog list (page, tag) |
| GET | `/blogs/:slug` | - | Blog post (increments view) |
| GET | `/testimonials` | - | Published testimonials |
| GET | `/faqs` | - | FAQ list |
| GET | `/seo/:pageKey` | - | Page SEO metadata |
| POST | `/contact` | - | Submit contact form |

### Bookings
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/bookings/slots` | - | Available slots (therapistId, from, to) |
| POST | `/bookings/slots/:id/hold` | Bearer | Hold slot (10s lock) |
| DELETE | `/bookings/slots/:id/hold` | Bearer | Release hold |
| POST | `/bookings` | Bearer | Book slot (atomic) |
| GET | `/bookings/me` | Bearer | My appointments |
| PATCH | `/bookings/:id/cancel` | Bearer | Cancel appointment |
| PATCH | `/bookings/:id/reschedule` | Bearer | Reschedule to new slot |

### Payments
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/payments/order` | Bearer | Create Razorpay order |
| POST | `/payments/verify` | Bearer | Verify payment signature |
| POST | `/payments/webhook` | - | Razorpay webhook (HMAC) |

### Admin (all require admin role)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/dashboard` | Stats: users, appts, revenue, pending |
| GET | `/admin/users` | List users (role, q, page) |
| PATCH | `/admin/users/:id/toggle-active` | Enable/disable user |
| POST | `/admin/therapists` | Create therapist profile |
| PATCH | `/admin/therapists/:id` | Update therapist |
| GET | `/admin/appointments` | All appointments (filters) |
| POST/PATCH/DELETE | `/admin/services/:id` | Service CRUD |
| POST/PATCH/DELETE | `/admin/blogs/:id` | Blog CMS |
| CRUD | `/admin/testimonials` | Testimonials |
| CRUD | `/admin/faqs` | FAQs |
| CRUD | `/admin/seo` | SEO metadata per page |
| GET/POST/PATCH | `/admin/settings` | Brand/theme/contact settings |
| GET | `/admin/contact-messages` | Inbox |

---

## Booking Concurrency Strategy

**Problem**: Two users book same slot simultaneously.

**Solution** (4 layers):

```
Request
  │
  ▼
① Rate limiter (20 req/min/IP)
  │
  ▼
② Redis Redlock distributed lock
   lock:slot:<slotId>  TTL 5-6s
   retries: 3 × 200ms jitter
  │
  ▼
③ MongoDB atomic findOneAndUpdate
   filter: { status: { $in: ['available', expired-hold] } }
   update: { status: 'booked', $inc: { version: 1 } }
   → only ONE writer succeeds; others get null → throw 409
  │
  ▼
④ MongoDB transaction (session)
   Slot update + Appointment create = atomic
   Unique index (therapist, startAt) = last safety net
  │
  ▼
⑤ Return appointment or throw "Slot not available"
```

**Hold flow** (payment gateway window):
```
1. POST /bookings/slots/:id/hold
   → Redlock acquire
   → Slot.status = 'held', heldUntil = now + 10s
   → Redis key: hold:slot:<id> = userId, PX 10000
2. User completes payment form
3. POST /bookings  (or payment verify webhook)
   → Redlock acquire again
   → Accept if held-by-me OR available OR hold-expired
4. Cron every 30s: sweep slots where heldUntil < now → reset to available
```

---

## Redis Strategy

| Key Pattern | TTL | Purpose |
|-------------|-----|---------|
| `refresh:<userId>:<jti>` | 7d | Track valid refresh tokens |
| `lock:slot:<slotId>` | 5-6s | Redlock mutex per slot |
| `hold:slot:<slotId>` | 10s | User hold marker |
| `cache:slots:<therapistId>:<date>` | 60s | Slot list cache (add if needed) |
| `session:<userId>` | 15m | Optional session store |

---

## Deployment Guide

### Option A: Managed (recommended for solo practitioner)

| Component | Service | Cost |
|-----------|---------|------|
| Next.js frontend | Vercel (free → Pro) | ~$0-20/mo |
| Node backend | Railway or Render | ~$5-15/mo |
| MongoDB | MongoDB Atlas M0 free / M10 | $0-57/mo |
| Redis | Upstash (serverless) | ~$0-10/mo |
| Email | Gmail App Password or Resend | $0-10/mo |
| Images | Cloudinary free tier | $0 |
| Domain | awakenwithsrishti.com | ~$10/yr |

**Vercel** (frontend):
```bash
npm i -g vercel
vercel --prod
# Set env vars in Vercel dashboard
```

**Railway** (backend):
```bash
railway login
railway up
# Set env vars in Railway dashboard
railway domain   # get your backend URL
```

### Option B: Docker on VPS (DigitalOcean / Hetzner)

```bash
# On server:
git clone <repo>
cd srishti-platform
cp backend/.env.example backend/.env
# Fill backend/.env
docker-compose up -d --build

# Nginx reverse proxy:
# frontend -> localhost:3000
# backend -> localhost:5000/api
```

### Production Nginx config

```nginx
server {
  server_name awakenwithsrishti.com;
  location / { proxy_pass http://localhost:3000; proxy_set_header Host $host; }
  location /api { proxy_pass http://localhost:5000; proxy_set_header Host $host; }
}
```

Run `certbot --nginx -d awakenwithsrishti.com` for TLS.

---

## Security Checklist

- [x] Helmet (XSS, CSP, HSTS headers)
- [x] CORS allowlist (specific origins only)
- [x] MongoDB sanitize (NoSQL injection prevention)
- [x] XSS-clean (request body sanitization)
- [x] HPP (HTTP parameter pollution)
- [x] Rate limiting (global + stricter on auth + booking)
- [x] JWT access tokens (15m) + refresh rotation
- [x] Refresh token JTI stored in Redis (revocable)
- [x] Bcrypt password hashing (rounds=12)
- [x] Zod input validation on all endpoints
- [x] Role-based access control middleware
- [x] Redlock distributed slot locking
- [x] MongoDB transactions (atomic booking)
- [x] Unique compound index (therapist, startAt)
- [x] Razorpay HMAC webhook signature verification
- [x] Secure Next.js headers (X-Frame-Options DENY, nosniff)
- [x] Admin routes behind role middleware
- [x] Audit log for all admin actions
- [x] `robots.txt` blocks /admin, /dashboard, /api
- [ ] Add CAPTCHA to contact form (recommended: Cloudflare Turnstile)
- [ ] Set MongoDB auth user (not default)
- [ ] Redis AUTH password in production
- [ ] Enable MongoDB Atlas IP allowlist
- [ ] DKIM/SPF for email domain
- [ ] Enable 2FA on Razorpay dashboard

---

## Implementation Phases

### Phase 1 — Core infrastructure ✅
- Backend server, Express app, middleware stack
- MongoDB + Redis connections
- Logger, error handler, env config

### Phase 2 — Database + Auth ✅
- All Mongoose schemas
- JWT auth with refresh rotation
- Email verification + password reset
- RBAC middleware

### Phase 3 — Booking Engine ✅
- Slot generation from availability templates
- Redlock + Mongo transaction booking flow
- Hold / release / sweep expired holds
- Cancel + reschedule with slot swap

### Phase 4 — Admin APIs + Content ✅
- Dashboard analytics
- User/therapist management
- Services, Blog, Testimonials, FAQ, SEO, Settings CRUD
- Contact message inbox + audit log

### Phase 5 — Frontend (Next.js) ✅
- Root layout, brand design system, Tailwind
- Homepage with hero, services, testimonials, FAQ, CTA
- About, Services, Contact, Blog pages
- Multi-step booking flow with slot picker
- Auth pages (login, register)
- User dashboard + appointments
- Admin panel shell
- Sitemap, robots.txt, JSON-LD schema, OG tags

### Phase 6 — Payments (Razorpay)
- Connect Razorpay order creation to booking flow
- Payment verify → confirm appointment
- Webhook handler for async payment events
- Refund handling on cancellation

### Phase 7 — Polish + Launch
- Add Cloudinary upload to admin for images
- Blog rich-text editor (TipTap or Quill)
- WhatsApp business link in booking confirmation
- Google Calendar / Zoom integration for meeting URLs
- E2E tests (Playwright)
- Performance audit (Lighthouse ≥ 90)
- CAPTCHA on contact form

---

## Default Credentials (seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@awakenwithsrishti.com | `ChangeMe@123` |
| Therapist (Srishti) | roysrishti010@gmail.com | `ChangeMe@123` |

**Change both passwords immediately after first login.**

---

## Contact & Branding

| Asset | Value |
|-------|-------|
| Brand name | Srishti Roy — Counselling Psychologist |
| Tagline | Healing through awareness, reflection, and self-understanding |
| Email | contact@awakentherapy.in |
| WhatsApp | +1 647 500 8349 |
| India phone | +91 8448 009 694 |
| Instagram | @awakenwithsrishti |
| Website | awakenwithsrishti.com |

---

*Built with care for Srishti Roy Counselling. Enterprise architecture, human purpose.*
