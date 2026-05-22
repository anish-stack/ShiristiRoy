import { ApiError } from '../utils/apiError.js';
import logger from '../utils/logger.js';

export const notFound = (req, res, next) => next(new ApiError(404, `Route ${req.originalUrl} not found`));

export const errorHandler = (err, req, res, _next) => {
  let { statusCode = 500, message = 'Internal Server Error', details = null } = err;
  if (err.name === 'ValidationError') { statusCode = 422; message = 'Validation failed'; details = err.errors; }
  if (err.name === 'CastError') { statusCode = 400; message = `Invalid ${err.path}`; }
  if (err.code === 11000) { statusCode = 409; message = 'Duplicate key'; details = err.keyValue; }
  if (err.name === 'JsonWebTokenError') { statusCode = 401; message = 'Invalid token'; }
  if (err.name === 'TokenExpiredError') { statusCode = 401; message = 'Token expired'; }

  if (statusCode >= 500) logger.error(err.stack || err.message);
  else logger.warn(`${statusCode} ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    details,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
