import rateLimit from 'express-rate-limit'

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: {
      message: 'Too many AI requests. Please wait a moment before asking again.',
    },
  },
})
