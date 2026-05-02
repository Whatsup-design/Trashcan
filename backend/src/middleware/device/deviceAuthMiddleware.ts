import type { NextFunction, Request, Response } from "express";

const ALLOWED_DEVICES: Record<string, string> = {
  "trashcan-01": "replace-this-with-your-device-secret",
};

export default function deviceAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const deviceId = req.header("x-device-id")?.trim();
  const deviceSecret = req.header("x-device-secret")?.trim();

  if (!deviceId || !deviceSecret) {
    return res.status(401).json({
      status: "ERROR",
      message: "Missing device credentials",
    });
  }

  const expectedSecret = ALLOWED_DEVICES[deviceId];

  if (!expectedSecret || deviceSecret !== expectedSecret) {
    return res.status(403).json({
      status: "ERROR",
      message: "Invalid device credentials",
    });
  }

  return next();
}
