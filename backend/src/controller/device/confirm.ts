import type { Request, Response } from "express";
import { deviceConfirm } from "../../services/device/devices.js";

export async function deviceConfirmController(req: Request, res: Response) {
  try {
    const { rfid, student_id, weight, event_id } = req.body as {
      rfid?: string;
      student_id?: number;
      weight?: number;
      event_id?: string;
    };

    if (!rfid || !rfid.trim()) {
      return res.status(400).json({
        status: "ERROR",
        message: "rfid is required",
      });
    }

    if (typeof weight !== "number") {
      return res.status(400).json({
        status: "ERROR",
        message: "weight is required",
      });
    }

    if (weight <= 0) {
      return res.status(400).json({
        status: "ERROR",
        message: "invalid weight",
      });
    }

    if (typeof student_id === "number" && student_id <= 0) {
      return res.status(400).json({
        status: "ERROR",
        message: "invalid student_id",
      });
    }

    if (event_id !== undefined && (!event_id || !event_id.trim())) {
      return res.status(400).json({
        status: "ERROR",
        message: "invalid event_id",
      });
    }

    const startedAt = Date.now();
    const result = await deviceConfirm({
      rfid: rfid.trim(),
      weight,
      ...(typeof student_id === "number" ? { student_id } : {}),
      ...(typeof event_id === "string" ? { event_id } : {}),
    });

    console.log("deviceConfirm OK", {
      rfid: rfid.trim(),
      student_id,
      status: result.status,
      ms: Date.now() - startedAt,
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
