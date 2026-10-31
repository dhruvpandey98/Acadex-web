import { validationResult } from 'express-validator'
import { AppError } from '../utils/errors.js'

export function validate(req, res, next) {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    const details = result.array({ onlyFirstError: true }).map(({ path, msg }) => ({ path, message: msg }))
    return next(new AppError(400, 'Request validation failed.', details))
  }
  return next()
}
