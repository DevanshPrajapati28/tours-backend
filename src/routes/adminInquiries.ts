import { Router, Request, Response } from 'express'
import { requireAuth } from '../middleware/auth'

const router = Router()

// ── Shared inquiry store (exported so stats can access it) ─────────────────
export type Inquiry = {
  id: string
  subject: string
  name: string
  email: string
  phone: string
  travelers: number
  date: string
  message: string
  status: 'new' | 'read' | 'resolved'
  createdAt: Date
}

export const inquiryStore: Inquiry[] = [
  // Seed data so admin panel isn't empty on first load
  {
    id: '1',
    subject: 'Maldives Luxury Overwater Escape',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 11111',
    travelers: 2,
    date: '2025-02-15',
    message: "I'm interested in the Maldives Luxury Overwater Escape. Please share more details.",
    status: 'new',
    createdAt: new Date('2025-01-10T09:30:00'),
  },
  {
    id: '2',
    subject: 'Switzerland Grand Tour',
    name: 'Priya & Arjun Mehta',
    email: 'priya.mehta@example.com',
    phone: '+91 99887 22222',
    travelers: 4,
    date: '2025-03-20',
    message: "We are a family of 4 looking for the Swiss Alps tour. Budget around ₹10L.",
    status: 'read',
    createdAt: new Date('2025-01-11T14:00:00'),
  },
  {
    id: '3',
    subject: 'Kerala Backwaters Bliss',
    name: 'Sneha Iyer',
    email: 'sneha.iyer@example.com',
    phone: '+91 99000 33333',
    travelers: 2,
    date: '2025-02-01',
    message: 'Would love a quote for Kerala backwaters houseboat trip for 2.',
    status: 'resolved',
    createdAt: new Date('2025-01-12T10:15:00'),
  },
]

// Public POST route (no auth) — used by the inquiry form
export const publicInquiryHandler = (req: Request, res: Response) => {
  const { name, email, phone, travelers, date, message, subject } = req.body
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'name, email and phone are required' })
  }
  const inquiry: Inquiry = {
    id: Date.now().toString(),
    subject: subject ?? 'General Inquiry',
    name, email, phone,
    travelers: parseInt(travelers) || 2,
    date: date ?? '',
    message: message ?? '',
    status: 'new',
    createdAt: new Date(),
  }
  inquiryStore.push(inquiry)
  console.log('[Inquiry received]', inquiry)
  res.status(201).json({ success: true, message: 'Inquiry received. We will contact you within 24 hours.' })
}

// ── Admin routes (require auth) ────────────────────────────────────────────
router.use(requireAuth)

// GET /api/admin/inquiries
router.get('/', (_req, res) => {
  res.json([...inquiryStore].sort((a, b) => +b.createdAt - +a.createdAt))
})

// PATCH /api/admin/inquiries/:id/status
router.patch('/:id/status', (req: Request, res: Response) => {
  const inquiry = inquiryStore.find(i => i.id === req.params.id)
  if (!inquiry) return res.status(404).json({ error: 'Not found' })
  const { status } = req.body
  if (!['new', 'read', 'resolved'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }
  inquiry.status = status
  res.json(inquiry)
})

// DELETE /api/admin/inquiries/:id
router.delete('/:id', (req: Request, res: Response) => {
  const idx = inquiryStore.findIndex(i => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const [removed] = inquiryStore.splice(idx, 1)
  res.json({ success: true, removed })
})

export default router
