import type { Request, Response } from "express";
import { deviceRegister } from "../../services/device/register.js";

type RegisterBody = {
  rfid?: unknown;
  student_id?: unknown;
};

function validateRegisterBody(body: RegisterBody) {
  if (typeof body.rfid !== "string" || !body.rfid.trim()) {
    return {
      error: {
        status: "ERROR",
        message: "rfid is required",
      },
    };
  }

  if (typeof body.student_id !== "number" || body.student_id <= 0) {
    return {
      error: {
        status: "ERROR",
        message: "valid student_id is required",
      },
    };
  }

  return {
    rfid: body.rfid.trim(),
    student_id: body.student_id,
  };
}

function logDeviceRegisterError(error: unknown) {
  console.error("[REGISTER] Device register error", {
    message: error instanceof Error ? error.message : String(error),
  });
}

export async function deviceRegisterController(req: Request, res: Response) {
  const startedAt = Date.now();

  try {
    const validation = validateRegisterBody(req.body as RegisterBody);

    if ("error" in validation) {
      console.warn("[REGISTER] Invalid request", {
        reason: validation.error.message,
        ms: Date.now() - startedAt,
      });

      return res.status(400).json(validation.error);
    }

    const result = await deviceRegister({
      rfid: validation.rfid,
      student_id: validation.student_id,
    });

    console.log("[REGISTER] OK", {
      rfid: validation.rfid,
      student_id: validation.student_id,
      status: result.status,
      ms: Date.now() - startedAt,
    });

    return res.status(200).json(result);
  } catch (error) {
    logDeviceRegisterError(error);

    return res.status(500).json({
      status: "ERROR",
      message: "Failed to register RFID",
    });
  }
}
