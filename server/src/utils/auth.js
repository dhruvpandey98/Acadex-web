import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'

export function tokenDigest(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, ver: user.tokenVersion || 0 }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' })
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, ver: user.tokenVersion || 0, jti: crypto.randomUUID() }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

export function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge,
  }
}
