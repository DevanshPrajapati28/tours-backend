import { Router, Request, Response } from 'express'

const router = Router()

const subscribers: string[] = []

// POST /api/newsletter/subscribe
router.post('/subscribe', (req: Request, res: Response) => {
  const { email } = req.body
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' })
  }
  if (subscribers.includes(email)) {
    return res.json({ success: true, message: 'Already subscribed' })
  }
  subscribers.push(email)
  console.log('[Newsletter] New subscriber:', email)
  res.status(201).json({ success: true, message: 'Subscribed successfully!' })
})

export default router
