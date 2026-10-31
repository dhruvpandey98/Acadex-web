const requiredSecrets = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']

export function validateEnvironment() {
  const missing = requiredSecrets.filter((key) => !process.env[key] || process.env[key].length < 32)
  if (missing.length) {
    throw new Error(`${missing.join(', ')} must each be configured with at least 32 characters.`)
  }
  if (process.env.JWT_ACCESS_SECRET === process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different values.')
  }
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required.')
}
