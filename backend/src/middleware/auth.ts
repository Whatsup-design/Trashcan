import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'

export type AuthUser = {
  accountId: string
  role: 'admin' | 'user'
}

export type AuthenticatedRequest = Request & {
  user?: AuthUser
}

const jwtSecretEnv = process.env.JWT_SECRET

if (!jwtSecretEnv) {
  throw new Error('Missing JWT_SECRET in backend environment variables')
}

const jwtSecret: string = jwtSecretEnv

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload

    if (
      typeof decoded.accountId !== 'string' ||
      (decoded.role !== 'admin' && decoded.role !== 'user')
    ) {
      return res.status(401).json({ message: 'Invalid token payload' })
    }

    req.user = {
      accountId: decoded.accountId,
      role: decoded.role,
    }

    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
