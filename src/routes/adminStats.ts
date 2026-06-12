import { Router, Request, Response } from 'express'
import { requireAuth } from '../middleware/auth'

const router = Router()
router.use(requireAuth)

// ── Shared in-memory stores (imported from other route modules) ───────────
// We expose them for admin reads here. In a real app, use a DB service layer.

// GET /api/admin/stats — aggregate dashboard stats
router.get('/stats', async (_req: Request, res: Response) => {
  // Dynamic import to get the live in-memory stores
  const { default: inquiriesData } = await import('./adminInquiries')
  res.json({
    totalPackages: (await import('../data')).packages.length,
    totalDestinations: (await import('../data')).destinations.length,
    totalInquiries: (inquiriesData as any)._count ?? 0,
    totalSubscribers: 0,
  })
})

export default router
