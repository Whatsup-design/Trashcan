import type { Request, Response } from "express";
import {
  deviceAuthentication,
  deviceScan,
} from "../../services/device/devices.js";

export async function deviceScanController(req: Request, res: Response) {
  try {
    const { rfid } = req.body as { rfid?: string };

    if (!rfid || !rfid.trim()) {
      return res.status(400).json({
        status: "ERROR",
        message: "rfid is required",
      });
    }

    const startedAt = Date.now();
    const result = await deviceScan(rfid.trim());

    console.log("deviceScan OK", {
      rfid: rfid.trim(),
      status: result.status,
      ms: Date.now() - startedAt,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("deviceScanController error:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Failed to scan RFID",
    });
  }
}

export async function deviceAuthenticationController(req: Request, res: Response) {
  try {
    const { rfid } = req.body as { rfid?: string };

    if (!rfid || !rfid.trim()) {
      return res.status(400).json({
        status: "ERROR",
        message: "rfid is required",
      });
    }

    const startedAt = Date.now();
    const result = await deviceAuthentication(rfid.trim());

    console.log("deviceAuthentication OK", {
      rfid: rfid.trim(),
      status: result.status,
      ms: Date.now() - startedAt,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("deviceAuthenticationController error:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Failed to authenticate RFID",
    });
  }
}
