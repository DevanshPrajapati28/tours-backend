import { Router, Request, Response } from 'express'
import { requireAuth } from '../middleware/auth'

import { packages as store, Package } from '../data'
let nextId = store.length + 1

const router = Router()
router.use(requireAuth)   // all admin package routes require auth

// GET /api/admin/packages
router.get('/', (_req: Request, res: Response) => {
  res.json(store)
})

// GET /api/admin/packages/:slug
router.get('/:slug', (req: Request, res: Response) => {
  const pkg = store.find(p => p.slug === req.params.slug)
  if (!pkg) return res.status(404).json({ error: 'Not found' })
  res.json(pkg)
})

// POST /api/admin/packages  — create
router.post('/', (req: Request, res: Response) => {
  const body = req.body as Partial<Package>
  if (!body.name || !body.slug || !body.destination) {
    return res.status(400).json({ error: 'name, slug and destination are required' })
  }
  if (store.find(p => p.slug === body.slug)) {
    return res.status(409).json({ error: 'Slug already exists' })
  }
  const pkg: Package = {
    slug: body.slug,
    name: body.name,
    type: body.type ?? 'Group',
    region: body.region ?? 'Domestic',
    destination: body.destination,
    country: body.country ?? 'India',
    duration: body.duration ?? '3 Days / 2 Nights',
    price: body.price ?? 0,
    discountPrice: body.discountPrice ?? 0,
    rating: body.rating ?? 4.5,
    reviews: body.reviews ?? 0,
    image: body.image ?? '/images/placeholder.jpg',
    highlights: body.highlights ?? [],
    inclusions: body.inclusions ?? [],
    exclusions: body.exclusions ?? [],
    itinerary: body.itinerary ?? [],
    faqs: body.faqs ?? [],
    featured: body.featured ?? false,
  }
  store.push(pkg)
  nextId++
  res.status(201).json(pkg)
})

// PUT /api/admin/packages/:slug  — update
router.put('/:slug', (req: Request, res: Response) => {
  const idx = store.findIndex(p => p.slug === req.params.slug)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  store[idx] = { ...store[idx], ...req.body, slug: req.params.slug }
  res.json(store[idx])
})

// DELETE /api/admin/packages/:slug
router.delete('/:slug', (req: Request, res: Response) => {
  const idx = store.findIndex(p => p.slug === req.params.slug)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const [removed] = store.splice(idx, 1)
  res.json({ success: true, removed })
})

export default router
