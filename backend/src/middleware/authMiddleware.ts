import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

export type AuthPayload = JwtPayload & {
  id?: number | string;
  student_id?: number | string;
  role?: string;
};

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!JWT_SECRET) {
    return res.status(500).json({ message: "Server auth is not configured" });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or malformed token" });
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    const user: NonNullable<Request["user"]> = {};
    if (decoded.id !== undefined) user.id = decoded.id;
    if (decoded.student_id !== undefined) user.student_id = decoded.student_id;
    if (decoded.role !== undefined) user.role = decoded.role;
    if (typeof decoded.iat === "number") user.iat = decoded.iat;
    if (typeof decoded.exp === "number") user.exp = decoded.exp;
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
