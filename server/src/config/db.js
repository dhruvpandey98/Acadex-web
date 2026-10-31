import mongoose from 'mongoose'

function safeErrorMessage(error, uri) {
  const message = error instanceof Error ? error.message : String(error)
  return message
    .replaceAll(uri, '[redacted MongoDB URI]')
    .replace(/(mongodb(?:\+srv)?:\/\/)[^@\s/]+@/gi, '$1[redacted]@')
}

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is required.')
  }

  try {
    await mongoose.connect(uri, { dbName: 'acadex' })
  } catch (error) {
    const message = safeErrorMessage(error, uri)
    console.error(`MongoDB connection failed: ${message}`)
    const safeError = new Error(message)
    safeError.name = error instanceof Error ? error.name : 'Error'
    throw safeError
  }

  console.info(`MongoDB connected to ${mongoose.connection.host}/${mongoose.connection.name}.`)
  mongoose.connection.on('error', (error) => {
    console.error(`MongoDB connection error: ${safeErrorMessage(error, uri)}`)
  })
  mongoose.connection.on('disconnected', () => {
    console.error('MongoDB connection lost.')
  })

  return mongoose.connection
}
