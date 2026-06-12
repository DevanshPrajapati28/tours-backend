"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../data");
const router = (0, express_1.Router)();
// GET /api/destinations
router.get('/', (req, res) => {
    const { region } = req.query;
    let result = [...data_1.destinations];
    if (region)
        result = result.filter(d => d.region === region);
    res.json(result);
});
// GET /api/destinations/:slug
router.get('/:slug', (req, res) => {
    const dest = data_1.destinations.find(d => d.slug === req.params.slug);
    if (!dest)
        return res.status(404).json({ error: 'Destination not found' });
    res.json(dest);
});
exports.default = router;
