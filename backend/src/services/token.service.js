import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { redis } from '../config/redis.js';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TTL = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_TTL = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const ISSUER = process.env.JWT_ISSUER || 'srishti.therapy';

export const signAccess = (payload) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL, issuer: ISSUER });

export const signRefresh = (payload) => {
  const jti = crypto.randomUUID();
  const token = jwt.sign({ ...payload, jti }, REFRESH_SECRET, { expiresIn: REFRESH_TTL, issuer: ISSUER });
  return { token, jti };
};

export const verifyAccess = (token) => jwt.verify(token, ACCESS_SECRET, { issuer: ISSUER });
export const verifyRefresh = (token) => jwt.verify(token, REFRESH_SECRET, { issuer: ISSUER });

// Refresh token rotation tracked in Redis: refresh:<userId>:<jti> => 1
export const storeRefreshJti = async (userId, jti, ttlSec) => {
  await redis.set(`refresh:${userId}:${jti}`, '1', 'EX', ttlSec);
};
export const isRefreshJtiValid = async (userId, jti) => {
  return Boolean(await redis.get(`refresh:${userId}:${jti}`));
};
export const revokeRefreshJti = async (userId, jti) => {
  await redis.del(`refresh:${userId}:${jti}`);
};
export const revokeAllRefresh = async (userId) => {
  const keys = await redis.keys(`refresh:${userId}:*`);
  if (keys.length) await redis.del(keys);
};

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
export const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
