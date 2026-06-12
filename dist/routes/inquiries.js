"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// In-memory store (replace with a DB in production)
const inquiries = [];
// POST /api/inquiries
router.post('/', (req, res) => {
    const { name, email, phone, travelers, date, message, subject } = req.body;
    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'name, email and phone are required' });
    }
    const inquiry = {
        id: Date.now().toString(),
        subject: subject ?? '',
        name, email, phone,
        travelers: travelers ?? 2,
        date: date ?? '',
        message: message ?? '',
        createdAt: new Date(),
    };
    inquiries.push(inquiry);
    console.log('[Inquiry received]', inquiry);
    res.status(201).json({ success: true, message: 'Inquiry received. We will contact you within 24 hours.' });
});
// GET /api/inquiries (admin — no auth in this demo)
router.get('/', (_req, res) => {
    res.json(inquiries);
});
exports.default = router;
