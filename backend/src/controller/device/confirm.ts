import type { Request, Response } from "express";
import { deviceConfirm } from "../../services/device/confirm.js";

type ConfirmBody = {
  rfid?: unknown;
  weight?: unknown;
  event_id?: unknown;
  bottle_count?: unknown;
};

function validateConfirmBody(body: ConfirmBody) {
  if (typeof body.rfid !== "string" || !body.rfid.trim()) {
    return {
      error: {
        status: "ERROR",
        message: "rfid is required",
      },
    };
  }

  if (typeof body.weight !== "number") {
    return {
      error: {
        status: "ERROR",
        message: "weight is required",
      },
    };
  }

  if (body.weight <= 0) {
    return {
      error: {
        status: "ERROR",
        message: "invalid weight",
      },
    };
  }

  if (typeof body.event_id !== "string" || !body.event_id.trim()) {
    return {
      error: {
        status: "ERROR",
        message: "event_id is required",
      },
    };
  }

  if (body.bottle_count !== undefined) {
    if (
      typeof body.bottle_count !== "number" ||
      !Number.isInteger(body.bottle_count) ||
      body.bottle_count <= 0
    ) {
      return {
        error: {
          status: "ERROR",
          message: "invalid bottle_count",
        },
      };
    }
  }

  return {
    rfid: body.rfid.trim(),
    weight: body.weight,
    event_id: body.event_id.trim(),
    ...(typeof body.bottle_count === "number" ? { bottle_count: body.bottle_count } : {}),
  };
}

function logDeviceConfirmError(error: unknown) {
  console.error("[CONFIRM] Device confirm error", {
    message: error instanceof Error ? error.message : String(error),
  });
}

export async function deviceConfirmController(req: Request, res: Response) {
  const startedAt = Date.now();

  try {
    const validation = validateConfirmBody(req.body as ConfirmBody);

    if ("error" in validation) {
      console.warn("[CONFIRM] Invalid request", {
        reason: validation.error.message,
        ms: Date.now() - startedAt,
      });

      return res.status(400).json(validation.error);
    }

    const result = await deviceConfirm({
      rfid: validation.rfid,
      weight: validation.weight,
      event_id: validation.event_id,
      ...("bottle_count" in validation ? { bottle_count: validation.bottle_count } : {}),
    });

    console.log("[CONFIRM] OK", {
      rfid: validation.rfid,
      status: result.status,
      ms: Date.now() - startedAt,
    });

    return res.status(200).json(result);
  } catch (error) {
    logDeviceConfirmError(error);

    return res.status(500).json({
      status: "ERROR",
      message: "Failed to confirm RFID",
    });
  }
}
