import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const ROLES = Object.freeze({ ADMIN: 'admin', THERAPIST: 'therapist', USER: 'user' });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, trim: true },
  passwordHash: { type: String, select: false },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String, index: true, sparse: true },
  role: { type: String, enum: Object.values(ROLES), default: ROLES.USER, index: true },
  avatar: { url: String, publicId: String },
  isEmailVerified: { type: Boolean, default: false },
  emailVerifyToken: { type: String, select: false },
  emailVerifyExpires: { type: Date, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  refreshTokenHash: { type: String, select: false },
  lastLoginAt: Date,
  isActive: { type: Boolean, default: true },
  preferredLanguage: { type: String, enum: ['en', 'hi', 'bn', 'ur'], default: 'en' },
  meta: {
    dob: Date,
    gender: { type: String, enum: ['male', 'female', 'nonbinary', 'prefer_not_say', null], default: null },
    timezone: { type: String, default: 'Asia/Kolkata' },
  },
}, { timestamps: true });

userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, Number(process.env.BCRYPT_ROUNDS || 12));
};
userSchema.methods.comparePassword = function (plain) {
  if (!this.passwordHash) return Promise.resolve(false);
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.methods.toJSON = function () {
  const o = this.toObject();
  delete o.passwordHash; delete o.refreshTokenHash;
  delete o.emailVerifyToken; delete o.passwordResetToken;
  delete o.emailVerifyExpires; delete o.passwordResetExpires;
  return o;
};

export default mongoose.model('User', userSchema);
