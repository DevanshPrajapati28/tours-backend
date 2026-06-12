import { Router, Request, Response } from 'express'

const router = Router()

// In-memory store (replace with a DB in production)
const inquiries: object[] = []

// POST /api/inquiries
router.post('/', (req: Request, res: Response) => {
  const { name, email, phone, travelers, date, message, subject } = req.body

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'name, email and phone are required' })
  }

  const inquiry = {
    id: Date.now().toString(),
    subject: subject ?? '',
    name, email, phone,
    travelers: travelers ?? 2,
    date: date ?? '',
    message: message ?? '',
    createdAt: new Date(),
  }

  inquiries.push(inquiry)
  console.log('[Inquiry received]', inquiry)

  res.status(201).json({ success: true, message: 'Inquiry received. We will contact you within 24 hours.' })
})

// GET /api/inquiries (admin — no auth in this demo)
router.get('/', (_req, res) => {
  res.json(inquiries)
})

export default router
