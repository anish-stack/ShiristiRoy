import User, { ROLES } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import {
  signAccess, signRefresh, verifyRefresh, storeRefreshJti, isRefreshJtiValid,
  revokeRefreshJti, revokeAllRefresh, hashToken, randomToken,
} from './token.service.js';
import { sendEmail, templates } from './email.service.js';
import bcrypt from 'bcryptjs';
import ms from '../utils/ms.js';

function buildPayload(user) {
  return { sub: user._id.toString(), role: user.role, email: user.email };
}

export async function register({ name, email, password, phone }) {
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'Email already registered');
  const user = new User({ name, email, phone, role: ROLES.USER });
  await user.setPassword(password);
  // email verification
  const raw = randomToken(32);
  user.emailVerifyToken = hashToken(raw);
  user.emailVerifyExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();
  const link = `${process.env.CLIENT_URL}/auth/verify?token=${raw}&email=${encodeURIComponent(email)}`;
  await sendEmail({ to: email, ...templates.verify(link) });
  return user.toJSON();
}

export async function verifyEmail({ email, token }) {
  const user = await User.findOne({ email }).select('+emailVerifyToken +emailVerifyExpires');
  if (!user) throw new ApiError(404, 'User not found');
  if (!user.emailVerifyToken || user.emailVerifyExpires < new Date())
    throw new ApiError(400, 'Token expired');
  if (user.emailVerifyToken !== hashToken(token)) throw new ApiError(400, 'Invalid token');
  user.isEmailVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpires = undefined;
  await user.save();
  return true;
}

export async function login({ email, password, ua, ip }) {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !user.isActive) throw new ApiError(401, 'Invalid credentials');
  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, 'Invalid credentials');
  const access = signAccess(buildPayload(user));
  const { token: refresh, jti } = signRefresh(buildPayload(user));
  const ttlSec = Math.floor(ms(process.env.JWT_REFRESH_EXPIRES_IN || '7d') / 1000);
  await storeRefreshJti(user._id.toString(), jti, ttlSec);
  user.lastLoginAt = new Date();
  await user.save();
  return { user: user.toJSON(), accessToken: access, refreshToken: refresh };
}

export async function refresh({ refreshToken }) {
  const decoded = verifyRefresh(refreshToken);
  const valid = await isRefreshJtiValid(decoded.sub, decoded.jti);
  if (!valid) throw new ApiError(401, 'Refresh token revoked');
  // rotate
  await revokeRefreshJti(decoded.sub, decoded.jti);
  const user = await User.findById(decoded.sub);
  if (!user || !user.isActive) throw new ApiError(401, 'User inactive');
  const access = signAccess(buildPayload(user));
  const { token: newRefresh, jti: newJti } = signRefresh(buildPayload(user));
  const ttlSec = Math.floor(ms(process.env.JWT_REFRESH_EXPIRES_IN || '7d') / 1000);
  await storeRefreshJti(user._id.toString(), newJti, ttlSec);
  return { accessToken: access, refreshToken: newRefresh };
}

export async function logout({ refreshToken }) {
  try {
    const decoded = verifyRefresh(refreshToken);
    await revokeRefreshJti(decoded.sub, decoded.jti);
  } catch { /* ignore */ }
  return true;
}

export async function logoutAll(userId) { await revokeAllRefresh(userId); return true; }

// services/auth.service.js

export async function requestPasswordReset({ email }) {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    const user = await User.findOne({ email });

    console.log(
      'Password reset requested for:',
      email,
      'User found:',
      !!user
    );

    // Do not leak user existence
    if (!user) {
      return true;
    }

    const raw = randomToken(32);

    user.passwordResetToken = hashToken(raw);
    user.passwordResetExpires = new Date(
      Date.now() + 30 * 60 * 1000
    );

    await user.save();

    const link = `${process.env.CLIENT_URL}/auth/reset?token=${raw}&email=${encodeURIComponent(email)}`;

    console.log(
      'Password reset link generated:',
      link
    );

    await sendEmail({
      to: email,
      ...templates.reset(link),
    });

    return true;
  } catch (error) {
    console.error('Forgot password error:', error);

    throw new Error(
      error.message || 'Failed to process password reset'
    );
  }
}

export async function resetPassword({ email, token, newPassword }) {
  const user = await User.findOne({ email }).select('+passwordResetToken +passwordResetExpires');

  if (!user || !user.passwordResetToken) throw new ApiError(400, 'Invalid reset request');
  if (user.passwordResetExpires < new Date()) throw new ApiError(400, 'Reset token expired');
  if (user.passwordResetToken !== hashToken(token)) throw new ApiError(400, 'Invalid token');
  await user.setPassword(newPassword);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  await revokeAllRefresh(user._id.toString());
  return true;
}
