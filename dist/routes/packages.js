"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../data");
const router = (0, express_1.Router)();
// GET /api/packages — list all (supports ?region=Domestic|International&type=&q=)
router.get('/', (req, res) => {
    let result = [...data_1.packages];
    const { region, type, q } = req.query;
    if (region)
        result = result.filter(p => p.region === region);
    if (type)
        result = result.filter(p => p.type === type);
    if (q) {
        const lq = q.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(lq) ||
            p.destination.toLowerCase().includes(lq) ||
            p.country.toLowerCase().includes(lq));
    }
    res.json(result);
});
// GET /api/packages/featured
router.get('/featured', (_req, res) => {
    res.json(data_1.packages.filter(p => p.featured));
});
// GET /api/packages/:slug
router.get('/:slug', (req, res) => {
    const pkg = data_1.packages.find(p => p.slug === req.params.slug);
    if (!pkg)
        return res.status(404).json({ error: 'Package not found' });
    res.json(pkg);
});
exports.default = router;
