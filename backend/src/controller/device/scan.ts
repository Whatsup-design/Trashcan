import type { Request, Response } from "express";
import { deviceScan } from "../../services/device/scan.js";

type ScanBody = {
  rfid?: unknown;
};

function validateRfid(body: ScanBody) {
  if (typeof body.rfid !== "string") {
    return {
      error: {
        status: "ERROR",
        message: "rfid is required",
      },
    };
  }

  const rfid = body.rfid.trim();

  if (!rfid) {
    return {
      error: {
        status: "ERROR",
        message: "rfid is required",
      },
    };
  }

  return { rfid };
}

function logDeviceScanError(label: string, error: unknown) {
  console.error(`[${label}] Device scan error`, {
    message: error instanceof Error ? error.message : String(error),
  });
}

export async function deviceScanController(req: Request, res: Response) {
  const label = "SCAN";
  const startedAt = Date.now();

  try {
    const validation = validateRfid(req.body as ScanBody);

    if ("error" in validation) {
      console.warn(`[${label}] Invalid request`, {
        reason: validation.error.message,
        ms: Date.now() - startedAt,
      });

      return res.status(400).json(validation.error);
    }

    const result = await deviceScan(validation.rfid);

    console.log(`[${label}] OK`, {
      rfid: validation.rfid,
      status: result.status,
      ms: Date.now() - startedAt,
    });

    return res.status(200).json(result);
  } catch (error) {
    logDeviceScanError(label, error);

    return res.status(500).json({
      status: "ERROR",
      message: "Failed to scan RFID",
    });
  }
}
