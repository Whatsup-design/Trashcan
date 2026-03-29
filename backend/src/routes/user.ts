import { Router } from 'express'

import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.use(authMiddleware)

router.get('/dashboard', (req, res) => {
  return res.json({
    message: 'User route is protected',
  })
})

export default router
