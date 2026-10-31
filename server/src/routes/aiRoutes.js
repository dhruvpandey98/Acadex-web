import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate } from '../middleware/auth.js'
import { aiRateLimiter } from '../middleware/aiRateLimiter.js'
import { validate } from '../middleware/validate.js'
import { askAcademicAssistant, getAcademicAssistantStatus } from '../controllers/aiController.js'

const router = Router()

router.use(authenticate)
router.get('/health', getAcademicAssistantStatus)
router.post('/ask', aiRateLimiter, body('message').isString().trim().isLength({ min: 1, max: 4000 }), validate, askAcademicAssistant)

export default router
