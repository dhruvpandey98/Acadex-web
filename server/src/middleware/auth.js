import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'
import { AppError, asyncHandler } from '../utils/errors.js'

export const authenticate = asyncHandler(async (req, res, next) => {
  const bearer = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
  const token = req.cookies?.acadex_access || bearer
  if (!token) throw new AppError(401, 'Authentication is required.')

  let payload
  try {
    payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
  } catch {
    throw new AppError(401, 'Your session is invalid or has expired.')
  }

  const user = await User.findById(payload.sub).select('+tokenVersion')
  if (!user || !user.isActive || user.tokenVersion !== payload.ver) {
    throw new AppError(401, 'Your session is no longer active.')
  }
  req.user = user
  next()
})

export function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError(403, 'You do not have permission to perform this action.'))
    }
    return next()
  }
}
