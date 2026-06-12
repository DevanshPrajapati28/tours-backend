"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginHandler = loginHandler;
exports.requireAuth = requireAuth;
// Simple token-based auth for the admin panel.
// In production, replace with JWT + a real user database.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? 'bmdt-admin-secret-token-2024';
/** POST /api/auth/login — returns a token */
function loginHandler(req, res) {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return res.json({ token: ADMIN_TOKEN, username });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
}
/** Middleware — verifies Bearer token on protected admin routes */
function requireAuth(req, res, next) {
    const auth = req.headers.authorization ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (token !== ADMIN_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}
