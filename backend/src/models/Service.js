import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  name: { type: String, required: true },
  shortDesc: { type: String, maxlength: 280 },
  description: { type: String },
  icon: String,

  coverImage: { url: String, publicId: String },
  durationMin: { type: Number, default: 50 },
  price: { amount: { type: Number, default: 0 }, currency: { type: String, default: 'INR' } },
  modes: [{ type: String, enum: ['online', 'in_person'] }],
  category: { type: String, enum: ['individual', 'family', 'couple', 'youth', 'group'], default: 'individual' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  seo: { metaTitle: String, metaDescription: String, ogImage: String, keywords: [String] },
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
