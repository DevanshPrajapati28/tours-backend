import { Router } from 'express'
import { loginHandler } from '../middleware/auth'

const router = Router()

// POST /api/auth/login
router.post('/login', loginHandler)

export default router
