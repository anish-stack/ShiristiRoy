export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const ok = (res, data, message = 'OK', status = 200) =>
  res.status(status).json({ success: true, message, data });

export const fail = (res, message, status = 400, details = null) =>
  res.status(status).json({ success: false, message, details });
