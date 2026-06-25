import { verifyAccess } from '../services/token.service.js';
import { ApiError } from '../utils/apiError.js';

export const authenticate = (required = true) => (req, res, next) => {
  const hdr = req.headers.authorization || '';
  console.log('🔑 Authorization header:', req.headers);
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) {
    if (!required) return next();
    return next(new ApiError(401, 'No token'));
  }
  console.log('🔐 Authenticating token:', token);
  try {
    const decoded = verifyAccess(token);
    console.log('✅ Token valid for user:', decoded);
    req.user = { id: decoded.sub, role: decoded.role, email: decoded.email };
    next();
  } catch (e) { next(e); }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return next(new ApiError(401, 'Unauthenticated'));
  if (!roles.includes(req.user.role)) return next(new ApiError(403, 'Forbidden'));
  next();
};
