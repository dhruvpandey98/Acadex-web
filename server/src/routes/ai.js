import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { body, param, query } from 'express-validator'
import { AssistantConversation } from '../models/index.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler, AppError } from '../utils/errors.js'
import { generateTutorReply } from '../services/aiTutor.js'

const router = Router()
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 12,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

router.use(authenticate)

router.get('/conversations',
  query('limit').optional().isInt({ min: 1, max: 50 }),
  validate,
  asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit || 20)
    const data = await AssistantConversation.find({ userId: req.user.id })
      .select('title lastMessageAt createdAt')
      .sort({ lastMessageAt: -1 })
      .limit(limit)
      .lean()
    res.json({ data })
  }),
)

router.post('/conversations', asyncHandler(async (req, res) => {
  const conversation = await AssistantConversation.create({ userId: req.user.id })
  res.status(201).json({ data: conversation })
}))

router.get('/conversations/:id',
  param('id').isMongoId(),
  validate,
  asyncHandler(async (req, res) => {
    const conversation = await AssistantConversation.findOne({ _id: req.params.id, userId: req.user.id })
    if (!conversation) throw new AppError(404, 'Study chat not found.')
    res.json({ data: conversation })
  }),
)

router.delete('/conversations/:id',
  param('id').isMongoId(),
  validate,
  asyncHandler(async (req, res) => {
    const conversation = await AssistantConversation.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!conversation) throw new AppError(404, 'Study chat not found.')
    res.status(204).end()
  }),
)

router.post('/conversations/:id/messages',
  chatLimiter,
  param('id').isMongoId(),
  body('message').isString().trim().isLength({ min: 1, max: 4000 }),
  validate,
  asyncHandler(async (req, res) => {
    const conversation = await AssistantConversation.findOne({ _id: req.params.id, userId: req.user.id })
    if (!conversation) throw new AppError(404, 'Study chat not found.')

    const prompt = req.body.message.trim()
    const history = [
      ...conversation.messages.map(({ role, content }) => ({ role, content })),
      { role: 'user', content: prompt },
    ]
    const reply = await generateTutorReply({ role: req.user.role, history })
    conversation.messages.push(
      { role: 'user', content: prompt },
      { role: 'assistant', content: reply, createdAt: new Date() },
    )
    conversation.messages = conversation.messages.slice(-40)
    if (conversation.messages.length === 2 && conversation.title === 'New study chat') {
      conversation.title = prompt.slice(0, 80)
    }
    conversation.lastMessageAt = new Date()
    await conversation.save()
    res.json({ data: { conversationId: conversation.id, messages: conversation.messages.slice(-2) } })
  }),
)

export default router
