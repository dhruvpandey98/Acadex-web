import { asyncHandler, AppError } from '../utils/errors.js'
import { generateAcademicAssistantReply } from '../services/geminiService.js'
import { getGeminiConfig } from '../config/gemini.js'

export const getAcademicAssistantStatus = asyncHandler(async (req, res) => {
  const { configured, model } = getGeminiConfig()
  res.json({
    data: {
      configured,
      model,
      route: '/api/ai/ask',
      requiresAuthentication: true,
    },
  })
})

export const askAcademicAssistant = asyncHandler(async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  if (!message) {
    throw new AppError(400, 'A message is required.')
  }

  const response = await generateAcademicAssistantReply({ user: req.user, message })
  res.json({
    data: {
      reply: response.answer,
      toolCalls: response.toolCalls,
      toolResults: response.toolResults,
    },
  })
})
