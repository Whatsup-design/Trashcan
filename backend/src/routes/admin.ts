import { Router } from 'express'

import { supabase } from '../lib/supabase.js'
import { authMiddleware } from '../middleware/auth.js'
import { isAdmin } from '../middleware/isAdmin.js'

const router = Router()

router.use(authMiddleware, isAdmin)

router.get('/dashboard', (req, res) => {
  return res.json({
    message: 'Admin route is protected',
  })
})

router.get('/Data', async (req, res) => {
  const { data, error } = await supabase
    .from('User')
    .select('*')
    .order('Student_ID', { ascending: true })

  if (error) {
    console.error('Failed to fetch users from Supabase:', error.message)

    return res.status(500).json({
      message: 'Failed to fetch users',
      error: error.message,
    })
  }

  console.log('Supabase users:', JSON.stringify(data, null, 2))

  return res.json({
    message: 'Fetched users successfully',
    data,
  })
})

export default router
