"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const subscribers = [];
// POST /api/newsletter/subscribe
router.post('/subscribe', (req, res) => {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Valid email is required' });
    }
    if (subscribers.includes(email)) {
        return res.json({ success: true, message: 'Already subscribed' });
    }
    subscribers.push(email);
    console.log('[Newsletter] New subscriber:', email);
    res.status(201).json({ success: true, message: 'Subscribed successfully!' });
});
exports.default = router;
