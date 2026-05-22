import 'dotenv/config';
import mongoose from 'mongoose';
import { connectMongo } from '../config/db.js';
import User, { ROLES } from '../models/User.js';
import Therapist from '../models/Therapist.js';
import Service from '../models/Service.js';
import { Faq, Testimonial, Settings, SeoMetadata } from '../models/index.js';
import { Availability } from '../models/Slot.js';

async function run() {
  await connectMongo();

  // Admin
  let admin = await User.findOne({ email: 'admin@awakenwithsrishti.com' });
  if (!admin) {
    admin = new User({ name: 'Admin', email: 'admin@awakenwithsrishti.com', role: ROLES.ADMIN, isEmailVerified: true });
    await admin.setPassword('ChangeMe@123');
    await admin.save();
  }

  // Therapist user (Srishti)
  let srUser = await User.findOne({ email: 'roysrishti010@gmail.com' });
  if (!srUser) {
    srUser = new User({
      name: 'Srishti Roy', email: 'roysrishti010@gmail.com', role: ROLES.THERAPIST,
      isEmailVerified: true, preferredLanguage: 'en',
    });
    await srUser.setPassword('ChangeMe@123');
    await srUser.save();
  }
  let srishti = await Therapist.findOne({ user: srUser._id });
  if (!srishti) {
    srishti = await Therapist.create({
      user: srUser._id, slug: 'srishti-roy',
      title: 'Counselling Psychologist',
      shortBio: 'Adlerian-informed, integrative counselling. Healing through awareness, reflection, and self-understanding.',
      bio: 'Srishti Roy is a registered Counselling Psychologist with over 3 years of experience working with individuals and groups across 12+ nationalities. Her practice draws from Adlerian psychology and integrative methods to support clients with anxiety, self-esteem, relationships, family dynamics, life transitions, stress, and self-understanding.',
      specializations: ['anxiety', 'self-esteem', 'emotional regulation', 'relationships', 'family', 'life transitions', 'student support'],
      approaches: ['Adlerian', 'Integrative', 'Insight-oriented', 'Reflective'],
      languages: ['en', 'hi', 'bn', 'ur'],
      yearsExperience: 3,
      consultationFee: { amount: 2500, currency: 'INR' },
      defaultSlotDurationMin: 50, bufferMin: 10,
      isAcceptingClients: true, isFeatured: true,
      seo: {
        metaTitle: 'Srishti Roy — Counselling Psychologist | Adlerian Therapy',
        metaDescription: 'Online and in-person counselling with Srishti Roy. Adlerian-informed therapy for anxiety, self-esteem, relationships, and personal growth.',
        keywords: ['counselling psychologist', 'adlerian therapy', 'online therapy India', 'anxiety therapy', 'family therapy'],
      },
    });
    // weekly availability: Mon-Fri 10:00-17:00
    const items = [];
    for (let d = 1; d <= 5; d += 1) {
      items.push({ therapist: srishti._id, dayOfWeek: d, startTime: '10:00', endTime: '17:00', slotDurationMin: 50, bufferMin: 10, mode: 'online' });
    }
    await Availability.insertMany(items);
  }

  // Services
  const services = [
    { slug: 'individual-counselling', name: 'Individual Counselling', category: 'individual',
      shortDesc: 'One-on-one therapy for emotional well-being, self-awareness, and growth.',
      description: 'Sessions tailored to support individuals in understanding patterns, navigating challenges, and developing healthier ways of relating to themselves and others.',
      durationMin: 50, price: { amount: 2500, currency: 'INR' }, modes: ['online', 'in_person'], order: 1 },
    { slug: 'family-therapy', name: 'Family Therapy', category: 'family',
      shortDesc: 'Strengthen communication, resolve conflicts, support healthier family dynamics.',
      description: 'A safe, collaborative space to explore relational patterns, emotional needs, boundaries, and collective healing.',
      durationMin: 75, price: { amount: 3500, currency: 'INR' }, modes: ['online', 'in_person'], order: 2 },
    { slug: 'online-therapy', name: 'Online Therapy Sessions', category: 'individual',
      shortDesc: 'Secure video counselling from the comfort of your own space.',
      description: 'Accessible and flexible mental health support for individuals and families across different locations.',
      durationMin: 50, price: { amount: 2500, currency: 'INR' }, modes: ['online'], order: 3 },
    { slug: 'adlerian-integrative-therapy', name: 'Adlerian-Informed & Integrative Therapy', category: 'individual',
      shortDesc: 'Reflective, insight-oriented therapy drawing from Adlerian psychology.',
      description: 'Explore life patterns, beliefs, early experiences, and personal meaning to support long-term emotional growth.',
      durationMin: 50, price: { amount: 2500, currency: 'INR' }, modes: ['online'], order: 4 },
    { slug: 'emotional-regulation', name: 'Emotional Regulation & Self-Understanding', category: 'individual',
      shortDesc: 'Build resilience, self-compassion, and healthier coping.',
      description: 'Therapy focused on understanding emotional responses, behavioural patterns, self-esteem, and coping mechanisms.',
      durationMin: 50, price: { amount: 2500, currency: 'INR' }, modes: ['online'], order: 5 },
    { slug: 'young-adult-support', name: 'Young Adult & Student Support', category: 'youth',
      shortDesc: 'Support for academic stress, identity, loneliness, burnout, and transitions.',
      description: 'For adolescents and young adults navigating transitional life stages.',
      durationMin: 50, price: { amount: 2000, currency: 'INR' }, modes: ['online'], order: 6 },
  ];
  for (const s of services) await Service.updateOne({ slug: s.slug }, { $set: s }, { upsert: true });

  // FAQs
  const faqs = [
    { question: 'What therapy approach do you use?', answer: 'I draw from Adlerian psychology and integrative counselling, focusing on awareness, life patterns, and meaningful personal growth.', order: 1 },
    { question: 'Which languages do you offer therapy in?', answer: 'English, Hindi, Bengali, and Urdu.', order: 2 },
    { question: 'Do you offer online sessions?', answer: 'Yes. Secure video sessions are available globally.', order: 3 },
    { question: 'How long is each session?', answer: 'Individual sessions are 50 minutes. Family sessions are 75 minutes.', order: 4 },
    { question: 'What is your cancellation policy?', answer: 'Cancellations 24+ hours before the session are eligible for refund or reschedule.', order: 5 },
  ];
  for (const f of faqs) await Faq.updateOne({ question: f.question }, { $set: f }, { upsert: true });

  // Testimonials (placeholder; replace with real)
  const testimonials = [
    { authorName: 'A.S.', rating: 5, text: 'Srishti created a safe, reflective space that helped me understand patterns I had been avoiding for years.', isPublished: true, isFeatured: true, order: 1 },
    { authorName: 'M.K.', rating: 5, text: 'Compassionate and grounded. Therapy with Srishti gave me language for my emotions.', isPublished: true, order: 2 },
  ];
  for (const t of testimonials) await Testimonial.updateOne({ authorName: t.authorName, text: t.text }, { $set: t }, { upsert: true });

  // Settings (brand)
  const settings = [
    { key: 'brand.name', value: 'Srishti Roy — Counselling Psychologist', group: 'brand' },
    { key: 'brand.tagline', value: 'Healing through awareness, reflection, and self-understanding.', group: 'brand' },
    { key: 'brand.colors', value: {
      primary: '#7C6AA8', // lavender
      secondary: '#9AAE92', // sage
      accent: '#6E89A7', // dusty blue
      bg: '#FBF7F0', // warm ivory
      text: '#2E2A33',
    }, group: 'theme' },
    { key: 'contact.email', value: 'contact@awakentherapy.in', group: 'contact' },
    { key: 'contact.phone', value: '+91 8448009694', group: 'contact' },
    { key: 'contact.whatsapp', value: '+1 647 500 8349', group: 'contact' },
    { key: 'social.instagram', value: 'awakenwithsrishti', group: 'social' },
  ];
  for (const s of settings) await Settings.updateOne({ key: s.key }, { $set: s }, { upsert: true });

  // SEO metadata
  const seoPages = [
    { pageKey: 'home', title: 'Srishti Roy — Counselling Psychologist | Adlerian Therapy', description: 'Online & in-person therapy for anxiety, relationships, self-esteem, family dynamics. Adlerian-informed integrative counselling.', keywords: ['counselling psychologist', 'therapy online India', 'adlerian therapy', 'anxiety therapy', 'family therapy'] },
    { pageKey: 'about', title: 'About Srishti Roy | Counselling Psychologist', description: 'Registered Counselling Psychologist with 3+ years experience, working across 12+ nationalities. Languages: English, Hindi, Bengali, Urdu.' },
    { pageKey: 'services', title: 'Therapy Services | Srishti Roy', description: 'Individual counselling, family therapy, online sessions, Adlerian-integrative therapy, emotional regulation, and young adult support.' },
    { pageKey: 'contact', title: 'Contact | Srishti Roy Counselling', description: 'Book a session or get in touch.' },
    { pageKey: 'blog', title: 'Blog | Srishti Roy Counselling', description: 'Reflections on awareness, healing, relationships, and growth.' },
  ];
  for (const s of seoPages) await SeoMetadata.updateOne({ pageKey: s.pageKey }, { $set: s }, { upsert: true });

  console.log('Seed complete.');
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
