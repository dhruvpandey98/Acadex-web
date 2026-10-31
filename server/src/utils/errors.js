export class AppError extends Error {
  constructor(status, message, details) {
    super(message)
    this.status = status
    this.details = details
  }
}

export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
}

export function notFound(req, res, next) {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)

  let status = error.status || 500
  let message = status >= 500 ? 'An unexpected server error occurred.' : error.message
  let details = error.details

  if (error.name === 'ValidationError') {
    status = 400
    message = 'Request validation failed.'
    details = Object.values(error.errors).map(({ path, message: detail }) => ({ path, message: detail }))
  } else if (error.name === 'CastError') {
    status = 400
    message = 'A supplied identifier or value is invalid.'
  } else if (error.code === 11000) {
    status = 409
    message = 'A record with the supplied unique value already exists.'
    details = Object.keys(error.keyPattern || {})
  } else if (error.type === 'entity.parse.failed') {
    status = 400
    message = 'Request body contains invalid JSON.'
  } else if (error.name === 'MulterError') {
    status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400
    message = error.message
  }

  if (status >= 500) console.error(error)
  res.status(status).json({ error: { message, ...(details ? { details } : {}) } })
}
