import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  max: Number(process.env.RATE_LIMIT_MAX || 100),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, try later' },
  // Slot availability checking (calendar UI polls this a lot) should never
  // get rate-limited by the global limiter.
  skip: (req) => {
    const p = req.path || req.originalUrl || '';
    return (
      p.endsWith('/bookings/slots') ||
      p.endsWith('/bookings/me') ||
  

      p.includes('/bookings/slots?') ||
      p.endsWith('/bookings/check-slot') ||
      p.endsWith('/bookings/admin/slots') ||
      p.includes('/bookings/admin/slots?')
    );
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts' },
});

export const bookingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, message: 'Slow down booking requests' },
});