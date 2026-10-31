import jwt from 'jsonwebtoken'
import { Conversation, User } from '../models/index.js'

export function configureSockets(io) {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token
      || socket.handshake.headers.cookie?.split('; ').find((part) => part.startsWith('acadex_access='))?.split('=').slice(1).join('=')
    if (!token) return next(new Error('Authentication required.'))
    try {
      const payload = jwt.verify(decodeURIComponent(token), process.env.JWT_ACCESS_SECRET)
      const user = await User.findById(payload.sub).select('+tokenVersion')
      if (!user || !user.isActive || user.tokenVersion !== payload.ver) return next(new Error('Session is invalid.'))
      socket.data.user = { id: user.id, role: user.role }
      return next()
    } catch {
      return next(new Error('Authentication failed.'))
    }
  })

  io.on('connection', (socket) => {
    const userRoom = `user:${socket.data.user.id}`
    socket.join(userRoom)
    socket.on('conversation:join', async (conversationId, callback) => {
      if (typeof conversationId !== 'string' || !/^[a-f\d]{24}$/i.test(conversationId)) {
        if (typeof callback === 'function') callback({ error: 'Conversation identifier is invalid.' })
        return
      }
      try {
        const conversation = await Conversation.exists({ _id: conversationId, participants: socket.data.user.id })
        if (!conversation) {
          if (typeof callback === 'function') callback({ error: 'Conversation access denied.' })
          return
        }
        socket.join(`conversation:${conversationId}`)
        if (typeof callback === 'function') callback({ joined: true })
      } catch (error) {
        console.error('Unable to join conversation room.', error)
        if (typeof callback === 'function') callback({ error: 'Unable to join conversation.' })
      }
    })
    socket.on('conversation:leave', (conversationId) => {
      if (typeof conversationId === 'string') socket.leave(`conversation:${conversationId}`)
    })
  })
}
