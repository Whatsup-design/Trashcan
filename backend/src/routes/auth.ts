import bcrypt from 'bcrypt'
import { Router, type Response } from 'express'
import jwt from 'jsonwebtoken'

import { supabase } from '../lib/supabase.js'
import {
  authMiddleware,
  type AuthenticatedRequest,
} from '../middleware/auth.js'

const router = Router()

const jwtSecretEnv = process.env.JWT_SECRET

if (!jwtSecretEnv) {
  throw new Error('Missing JWT_SECRET in backend environment variables')
}

const jwtSecret: string = jwtSecretEnv
const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? '1d'
const jwtSignOptions = { expiresIn: jwtExpiresIn } as jwt.SignOptions

router.post('/login', async (req, res) => {
  const { loginId, studentId, username, password } = req.body as {
    loginId?: number | string
    studentId?: number | string
    username?: string
    password?: string
  }

  const rawLoginId = loginId ?? studentId ?? username

  if (!rawLoginId || !password) {
    return res.status(400).json({
      success: false,
      role: null,
      message: 'loginId and password are required',
    })
  }

  const normalizedLoginId = String(rawLoginId).trim()
  const numericLoginId = Number(normalizedLoginId)
  const lookupValue = Number.isNaN(numericLoginId)
    ? normalizedLoginId
    : numericLoginId

  const { data: admin, error: adminError } = await supabase
    .from('Admin')
    .select('Admin_ID, Admin_Name, Admin_Password')
    .eq('Admin_ID', lookupValue)
    .maybeSingle()

  if (adminError) {
    return res.status(500).json({
      success: false,
      role: null,
      message: 'Failed to fetch admin account',
      error: adminError.message,
    })
  }

  if (admin) {
    const isAdminPasswordValid = await bcrypt.compare(
      password,
      admin.Admin_Password,
    )

    if (!isAdminPasswordValid) {
      return res.status(401).json({
        success: false,
        role: null,
        message: 'Invalid credentials',
      })
    }

    const token = jwt.sign(
      {
        accountId: String(admin.Admin_ID),
        role: 'admin',
      },
      jwtSecret,
      jwtSignOptions,
    )

    return res.json({
      success: true,
      message: 'Login successful',
      role: 'admin',
      token,
      user: {
        id: admin.Admin_ID,
        name: admin.Admin_Name,
        role: 'admin',
      },
    })
  }

  const { data: user, error: userError } = await supabase
    .from('User')
    .select(
      'Student_ID, Student_Email, Student_Name, Student_Tokens, Student_Bottles, password_hash, role, status',
    )
    .eq('Student_ID', lookupValue)
    .maybeSingle()

  if (userError) {
    return res.status(500).json({
      success: false,
      role: null,
      message: 'Failed to fetch user',
      error: userError.message,
    })
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      role: null,
      message: 'Invalid credentials',
    })
  }

  if (!user.password_hash) {
    return res.status(403).json({
      success: false,
      role: null,
      message: 'This account has no password configured yet',
    })
  }

  if (user.status && user.status !== 'active') {
    return res.status(403).json({
      success: false,
      role: null,
      message: 'This account is inactive',
    })
  }

  const isUserPasswordValid = await bcrypt.compare(password, user.password_hash)

  if (!isUserPasswordValid) {
    return res.status(401).json({
      success: false,
      role: null,
      message: 'Invalid credentials',
    })
  }

  const token = jwt.sign(
    {
      accountId: String(user.Student_ID),
      role: 'user',
    },
    jwtSecret,
    jwtSignOptions,
  )

  return res.json({
    success: true,
    message: 'Login successful',
    role: 'user',
    token,
    user: {
      studentId: user.Student_ID,
      email: user.Student_Email,
      name: user.Student_Name,
      role: 'user',
      tokenBalance: user.Student_Tokens,
      bottleCount: user.Student_Bottles,
    },
  })
})

router.get(
  '/me',
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const accountId = req.user?.accountId
    const role = req.user?.role

    if (!accountId || !role) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (role === 'admin') {
      const { data: admin, error: adminError } = await supabase
        .from('Admin')
        .select('Admin_ID, Admin_Name')
        .eq('Admin_ID', accountId)
        .maybeSingle()

      if (adminError) {
        return res.status(500).json({
          message: 'Failed to fetch current admin',
          error: adminError.message,
        })
      }

      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' })
      }

      return res.json({
        user: {
          id: admin.Admin_ID,
          name: admin.Admin_Name,
          role: 'admin',
        },
      })
    }

    const { data: user, error: userError } = await supabase
      .from('User')
      .select(
        'Student_ID, RFID_ID, Student_Email, Student_Name, Student_Tokens, Student_Bottles, status',
      )
      .eq('Student_ID', Number(accountId))
      .maybeSingle()

    if (userError) {
      return res.status(500).json({
        message: 'Failed to fetch current user',
        error: userError.message,
      })
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({
      user: {
        studentId: user.Student_ID,
        rfidId: user.RFID_ID,
        email: user.Student_Email,
        name: user.Student_Name,
        role: 'user',
        status: user.status || 'active',
        tokenBalance: user.Student_Tokens,
        bottleCount: user.Student_Bottles,
      },
    })
  },
)

export default router
