import { supabase } from "../../lib/supabase.js";
import { registerOrBindStudentForConfirm } from "./register.js";
import {
  buildTokenAddedMessage,
  calculateTokens,
  createDeviceNotificationSafe,
  type DeviceConfirmInput,
  markInflightDeviceEvent,
  normalizeWeightForDb,
  releaseInflightDeviceEvent,
  type UserRow,
  updateUserCountersWithRetry,
  wasEventProcessed,
  writeDeviceActivityLog,
} from "./shared.js";

export async function deviceConfirm(input: DeviceConfirmInput) {
  const { rfid, student_id, weight, event_id } = input;
  const storedWeight = normalizeWeightForDb(weight);
  const tokens_earned = calculateTokens(weight);
  const now = new Date().toISOString();
  const normalizedEventId = event_id?.trim() || undefined;

  if (normalizedEventId) {
    if (!markInflightDeviceEvent(normalizedEventId)) {
      return { status: "DUPLICATE_EVENT" as const };
    }

    const alreadyDone = await wasEventProcessed(normalizedEventId);
    if (alreadyDone) {
      releaseInflightDeviceEvent(normalizedEventId);
      return { status: "DUPLICATE_EVENT" as const };
    }
  }

  try {
    const { data: existingRfidUser, error: existingRfidUserError } = await supabase
      .from("User")
      .select(
        "Student_ID, RFID_ID, Student_FullNameT, Student_Tokens, Student_weight, Student_Bottles"
      )
      .eq("RFID_ID", rfid)
      .maybeSingle();

    if (existingRfidUserError) {
      throw existingRfidUserError;
    }

    const currentUser = existingRfidUser as UserRow | null;

    if (currentUser) {
      if (typeof student_id === "number" && student_id !== currentUser.Student_ID) {
        console.warn("deviceConfirm RFID/student mismatch", {
          rfid,
          scanned_student_id: student_id,
          bound_student_id: currentUser.Student_ID,
        });
        return { status: "RFID_STUDENT_MISMATCH" as const };
      }

      const updated = await updateUserCountersWithRetry({
        studentId: currentUser.Student_ID,
        rfid,
        tokensEarned: tokens_earned,
        storedWeight,
        now,
        allowBindRfid: false,
      });

      if (updated.status !== "SUCCESS") {
        return { status: updated.status };
      }

      await writeDeviceActivityLog({
        studentId: currentUser.Student_ID,
        studentName: updated.name ?? null,
        tokensEarned: tokens_earned,
        weight: storedWeight,
        ...(normalizedEventId ? { eventId: normalizedEventId } : {}),
      });

      await createDeviceNotificationSafe({
        studentId: currentUser.Student_ID,
        type: "TOKEN_ADDED",
        title: "Token added",
        message: buildTokenAddedMessage(tokens_earned, storedWeight),
        metadata: {
          tokensEarned: tokens_earned,
          weight: storedWeight,
          eventId: normalizedEventId ?? null,
        },
      });

      return {
        status: "SUCCESS" as const,
        name: updated.name,
        weight: storedWeight,
        tokens_earned,
        tokens: updated.tokens,
      };
    }

    if (typeof student_id !== "number") {
      return { status: "INVALID_STUDENT_ID" as const };
    }

    return registerOrBindStudentForConfirm({
      rfid,
      studentId: student_id,
      tokensEarned: tokens_earned,
      storedWeight,
      now,
      ...(normalizedEventId ? { normalizedEventId } : {}),
    });
  } finally {
    releaseInflightDeviceEvent(normalizedEventId);
  }
}
