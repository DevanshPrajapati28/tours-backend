import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRouter from './routes/auth'
import packagesRouter from './routes/packages'
import destinationsRouter from './routes/destinations'
import newsletterRouter from './routes/newsletter'
import adminPackagesRouter from './routes/adminPackages'
import adminInquiriesRouter, { publicInquiryHandler, inquiryStore } from './routes/adminInquiries'
import { requireAuth } from './middleware/auth'
import { packages } from './data'
import { destinations } from './data'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 5000

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }))
app.use(express.json())

// ── Request logger ─────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// ── Public routes ──────────────────────────────────────────────────────────
app.use('/api/auth', authRouter)
app.use('/api/packages', packagesRouter)
app.use('/api/destinations', destinationsRouter)
app.use('/api/newsletter', newsletterRouter)
app.post('/api/inquiries', publicInquiryHandler)   // public inquiry form submission

// ── Admin-only routes ──────────────────────────────────────────────────────
app.use('/api/admin/packages',    adminPackagesRouter)
app.use('/api/admin/inquiries',   adminInquiriesRouter)

// Newsletter subscribers store
const subscribers: { email: string; createdAt: Date }[] = []

app.post('/api/newsletter/subscribe', (req, res) => {
  const { email } = req.body
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' })
  }
  if (subscribers.find(s => s.email === email)) {
    return res.json({ success: true, message: 'Already subscribed' })
  }
  subscribers.push({ email, createdAt: new Date() })
  console.log('[Newsletter] New subscriber:', email)
  res.status(201).json({ success: true, message: 'Subscribed successfully!' })
})

// Admin: get all subscribers
app.get('/api/admin/subscribers', requireAuth, (_req, res) => {
  res.json([...subscribers].reverse())
})

// Admin: dashboard stats
app.get('/api/admin/stats', requireAuth, (_req, res) => {
  const newInquiries = inquiryStore.filter(i => i.status === 'new').length
  res.json({
    totalPackages: packages.length,
    totalDestinations: destinations.length,
    totalInquiries: inquiryStore.length,
    newInquiries,
    totalSubscribers: subscribers.length,
  })
})

// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }))

// ── 404 handler ────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }))

// ── Error handler ──────────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`✅ Express server running at http://localhost:${PORT}`)
  console.log(`🔐 Admin credentials → username: admin  /  password: admin123`)
})

export default app
