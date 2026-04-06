import type { Request, Response } from "express";
import { deviceConfirm, deviceScan } from "../../services/admin/devices.js";

export async function deviceScanController(req: Request, res: Response) {
  try {
    const { rfid } = req.body as { rfid?: string };

    if (!rfid) {
      return res.status(400).json({
        status: "ERROR",
        message: "rfid is required",
      });
    }

    const result = await deviceScan(rfid);
    return res.status(200).json(result);
  } catch (error) {
    console.error("deviceScanController error:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Failed to scan RFID",
    });
  }
}

export async function deviceConfirmController(req: Request, res: Response) {
  try {
    const { rfid, student_id, weight, tokens_earned } = req.body as {
      rfid?: string;
      student_id?: number;
      weight?: number;
      tokens_earned?: number;
    };

    if (!rfid) {
      return res.status(400).json({
        status: "ERROR",
        message: "rfid is required",
      });
    }

    if (typeof weight !== "number" || typeof tokens_earned !== "number") {
      return res.status(400).json({
        status: "ERROR",
        message: "weight and tokens_earned are required",
      });
    }

    const result = await deviceConfirm({
      rfid,
      weight,
      tokens_earned,
      ...(typeof student_id === "number" ? { student_id } : {}),
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("deviceConfirmController error:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Failed to confirm RFID",
    });
  }
}
