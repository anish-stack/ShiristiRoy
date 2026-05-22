import mongoose from 'mongoose';

const therapistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  title: { type: String, default: 'Counselling Psychologist' },
  bio: { type: String, maxlength: 4000 },
  shortBio: { type: String, maxlength: 280 },
  specializations: [{ type: String, index: true }], // anxiety, family, self-esteem...
  approaches: [String], // Adlerian, Integrative...
  languages: [{ type: String, enum: ['en', 'hi', 'bn', 'ur', 'other'] }],
  yearsExperience: { type: Number, default: 0 },
  certifications: [{
    name: String, issuer: String, year: Number, documentUrl: String,
  }],
  registration: { body: String, number: String },
  consultationFee: { amount: { type: Number, default: 0 }, currency: { type: String, default: 'INR' } },
  defaultSlotDurationMin: { type: Number, default: 50 },
  bufferMin: { type: Number, default: 10 },
  timezone: { type: String, default: 'Asia/Kolkata' },
  isAcceptingClients: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  gallery: [{ url: String, publicId: String, alt: String }],
  videoIntroUrl: String,
  rating: { avg: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  seo: {
    metaTitle: String, metaDescription: String, ogImage: String, keywords: [String],
  },
}, { timestamps: true });

therapistSchema.index({ specializations: 1, isAcceptingClients: 1 });

export default mongoose.model('Therapist', therapistSchema);
