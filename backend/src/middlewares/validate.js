import { ApiError } from '../utils/apiError.js';

export const validate = (schemas) => (req, res, next) => {
  try {
    if (schemas.body) req.body = schemas.body.parse(req.body);
    if (schemas.query) req.query = schemas.query.parse(req.query);
    if (schemas.params) req.params = schemas.params.parse(req.params);
    next();
  } catch (e) {
    return next(new ApiError(422, 'Validation failed', e.errors || e.message));
  }
};
