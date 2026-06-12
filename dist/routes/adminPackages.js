"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const data_1 = require("../data");
let nextId = data_1.packages.length + 1;
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth); // all admin package routes require auth
// GET /api/admin/packages
router.get('/', (_req, res) => {
    res.json(data_1.packages);
});
// GET /api/admin/packages/:slug
router.get('/:slug', (req, res) => {
    const pkg = data_1.packages.find(p => p.slug === req.params.slug);
    if (!pkg)
        return res.status(404).json({ error: 'Not found' });
    res.json(pkg);
});
// POST /api/admin/packages  — create
router.post('/', (req, res) => {
    const body = req.body;
    if (!body.name || !body.slug || !body.destination) {
        return res.status(400).json({ error: 'name, slug and destination are required' });
    }
    if (data_1.packages.find(p => p.slug === body.slug)) {
        return res.status(409).json({ error: 'Slug already exists' });
    }
    const pkg = {
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
    };
    data_1.packages.push(pkg);
    nextId++;
    res.status(201).json(pkg);
});
// PUT /api/admin/packages/:slug  — update
router.put('/:slug', (req, res) => {
    const idx = data_1.packages.findIndex(p => p.slug === req.params.slug);
    if (idx === -1)
        return res.status(404).json({ error: 'Not found' });
    data_1.packages[idx] = { ...data_1.packages[idx], ...req.body, slug: req.params.slug };
    res.json(data_1.packages[idx]);
});
// DELETE /api/admin/packages/:slug
router.delete('/:slug', (req, res) => {
    const idx = data_1.packages.findIndex(p => p.slug === req.params.slug);
    if (idx === -1)
        return res.status(404).json({ error: 'Not found' });
    const [removed] = data_1.packages.splice(idx, 1);
    res.json({ success: true, removed });
});
exports.default = router;
