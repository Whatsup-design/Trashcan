import { rateLimit } from "express-rate-limit";
import type { Request } from "express";

function getDeviceKey(req: Request) {
  return req.header("x-device-id")?.trim() || req.ip || "unknown-device";
}

export const loginRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "ERROR",
    message: "Too many login attempts. Please try again later.",
  },
});

export const deviceScanRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getDeviceKey,
  message: {
    status: "ERROR",
    message: "Too many device scan requests. Please slow down.",
  },
});

export const deviceConfirmRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getDeviceKey,
  message: {
    status: "ERROR",
    message: "Too many device confirm requests. Please slow down.",
  },
});
