import type { NextFunction, Request, Response } from "express";

export default function deviceAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const deviceId = req.header("x-device-id")?.trim();
  const deviceSecret = req.header("x-device-secret")?.trim();
  const expectedDeviceId = process.env.DEVICE_ID?.trim() || "trashcan-01";
  const expectedDeviceSecret = process.env.DEVICE_SECRET?.trim();

  if (!deviceId || !deviceSecret) {
    return res.status(401).json({
      status: "ERROR",
      message: "Missing device credentials",
    });
  }

  if (!expectedDeviceSecret) {
    console.error("[DEVICE_AUTH] DEVICE_SECRET is not configured");
    return res.status(500).json({
      status: "ERROR",
      message: "Device authentication is not configured",
    });
  }

  if (deviceId !== expectedDeviceId || deviceSecret !== expectedDeviceSecret) {
    return res.status(403).json({
      status: "ERROR",
      message: "Invalid device credentials",
    });
  }

  return next();
}
