import type { Request, Response } from "express";

// Reserved for the dedicated /device/register flow.
// We keep this file now so the device controller structure matches
// the intended scan/register/confirm sequence.
export async function deviceRegisterController(_req: Request, res: Response) {
  return res.status(501).json({
    status: "ERROR",
    message: "Device register flow is not implemented yet",
  });
}
