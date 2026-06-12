import { Router } from 'express'
import { packages } from '../data'

const router = Router()

// GET /api/packages — list all (supports ?region=Domestic|International&type=&q=)
router.get('/', (req, res) => {
  let result = [...packages]
  const { region, type, q } = req.query as Record<string, string>
  if (region) result = result.filter(p => p.region === region)
  if (type) result = result.filter(p => p.type === type)
  if (q) {
    const lq = q.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(lq) ||
      p.destination.toLowerCase().includes(lq) ||
      p.country.toLowerCase().includes(lq)
    )
  }
  res.json(result)
})

// GET /api/packages/featured
router.get('/featured', (_req, res) => {
  res.json(packages.filter(p => p.featured))
})

// GET /api/packages/:slug
router.get('/:slug', (req, res) => {
  const pkg = packages.find(p => p.slug === req.params.slug)
  if (!pkg) return res.status(404).json({ error: 'Package not found' })
  res.json(pkg)
})

export default router
