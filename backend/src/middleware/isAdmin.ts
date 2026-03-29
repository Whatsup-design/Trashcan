import type { NextFunction, Response } from 'express'

import type { AuthenticatedRequest } from './auth.js'

export function isAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  return next()
}
