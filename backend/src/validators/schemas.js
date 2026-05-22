import { z } from 'zod';

export const authSchemas = {
  register: { body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(128),
    phone: z.string().optional(),
  }) },
  login: { body: z.object({ email: z.string().email(), password: z.string().min(8) }) },
  verifyEmail: { body: z.object({ email: z.string().email(), token: z.string() }) },
  refresh: { body: z.object({ refreshToken: z.string() }) },
  forgot: { body: z.object({ email: z.string().email() }) },
  reset: { body: z.object({ email: z.string().email(), token: z.string(), newPassword: z.string().min(8) }) },
};

export const bookingSchemas = {
  listSlots: { query: z.object({
    therapistId: z.string().min(1),
    from: z.string().datetime().or(z.string().min(8)),
    to: z.string().datetime().or(z.string().min(8)),
    service:z.string(),
    mode: z.enum(['online', 'in_person']).optional(),
  }) },
  checkSlots: { query: z.object({
    therapistId: z.string().min(1),
    from: z.string().datetime().or(z.string().min(8)),
    service:z.string(),
    to: z.string().datetime().or(z.string().min(8)),
    mode: z.enum(['online', 'in_person']).optional(),
  }) },
  book: { body: z.object({
    slotId: z.string().min(1),
    serviceId: z.string().optional(),
    mode: z.enum(['online', 'in_person']).optional(),
    intake: z.object({
      primaryConcern: z.string().optional(),
      prevTherapy: z.boolean().optional(),
      notes: z.string().max(2000).optional(),
      emergencyContact: z.object({
        name: z.string().optional(), phone: z.string().optional(), relation: z.string().optional(),
      }).optional(),
    }).optional(),
  }) },
  reschedule: { body: z.object({ newSlotId: z.string().min(1) }) },
};

export const contactSchema = {
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(10).max(5000),
  }),
};
