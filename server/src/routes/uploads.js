import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { Router } from 'express'
import multer from 'multer'
import { authenticate } from '../middleware/auth.js'
import { Upload } from '../models/index.js'
import { AppError, asyncHandler } from '../utils/errors.js'

const router = Router()
const directory = path.resolve(process.cwd(), 'uploads')
const acceptedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/plain'])
const storage = multer.diskStorage({
  destination: directory,
  filename: (req, file, callback) => callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
})
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!acceptedTypes.has(file.mimetype)) return callback(new AppError(400, 'Only PDF, PNG, JPEG, WebP, or plain-text files are accepted.'))
    return callback(null, true)
  },
})

router.use(authenticate)

router.post('/', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError(400, 'A file is required.')
  const data = await Upload.create({
    storedName: req.file.filename,
    originalName: path.basename(req.file.originalname),
    mimeType: req.file.mimetype,
    size: req.file.size,
    storedBy: req.user.id,
  })
  res.status(201).json({ data: { id: data.id, name: data.originalName, url: `/api/uploads/${data.id}` } })
}))

router.get('/:id', asyncHandler(async (req, res) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) throw new AppError(400, 'Upload identifier is invalid.')
  const file = await Upload.findOne({ _id: req.params.id, storedBy: req.user.id })
  if (!file) throw new AppError(404, 'File not found.')
  res.type(file.mimeType)
  res.set('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalName)}"`)
  res.sendFile(path.join(directory, file.storedName))
}))

export default router
