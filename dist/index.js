"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const packages_1 = __importDefault(require("./routes/packages"));
const destinations_1 = __importDefault(require("./routes/destinations"));
const newsletter_1 = __importDefault(require("./routes/newsletter"));
const adminPackages_1 = __importDefault(require("./routes/adminPackages"));
const adminInquiries_1 = __importStar(require("./routes/adminInquiries"));
const auth_2 = require("./middleware/auth");
const data_1 = require("./data");
const data_2 = require("./data");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 5000;
// ── Middleware ─────────────────────────────────────────────────────────────
app.use((0, cors_1.default)({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:3000' }));
app.use(express_1.default.json());
// ── Request logger ─────────────────────────────────────────────────────────
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
// ── Public routes ──────────────────────────────────────────────────────────
app.use('/api/auth', auth_1.default);
app.use('/api/packages', packages_1.default);
app.use('/api/destinations', destinations_1.default);
app.use('/api/newsletter', newsletter_1.default);
app.post('/api/inquiries', adminInquiries_1.publicInquiryHandler); // public inquiry form submission
// ── Admin-only routes ──────────────────────────────────────────────────────
app.use('/api/admin/packages', adminPackages_1.default);
app.use('/api/admin/inquiries', adminInquiries_1.default);
// Newsletter subscribers store
const subscribers = [];
app.post('/api/newsletter/subscribe', (req, res) => {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Valid email is required' });
    }
    if (subscribers.find(s => s.email === email)) {
        return res.json({ success: true, message: 'Already subscribed' });
    }
    subscribers.push({ email, createdAt: new Date() });
    console.log('[Newsletter] New subscriber:', email);
    res.status(201).json({ success: true, message: 'Subscribed successfully!' });
});
// Admin: get all subscribers
app.get('/api/admin/subscribers', auth_2.requireAuth, (_req, res) => {
    res.json([...subscribers].reverse());
});
// Admin: dashboard stats
app.get('/api/admin/stats', auth_2.requireAuth, (_req, res) => {
    const newInquiries = adminInquiries_1.inquiryStore.filter(i => i.status === 'new').length;
    res.json({
        totalPackages: data_1.packages.length,
        totalDestinations: data_2.destinations.length,
        totalInquiries: adminInquiries_1.inquiryStore.length,
        newInquiries,
        totalSubscribers: subscribers.length,
    });
});
// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));
// ── 404 handler ────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
// ── Error handler ──────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});
app.listen(PORT, () => {
    console.log(`✅ Express server running at http://localhost:${PORT}`);
    console.log(`🔐 Admin credentials → username: admin  /  password: admin123`);
});
exports.default = app;
