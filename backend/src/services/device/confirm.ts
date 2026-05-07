import { supabase } from "../../lib/supabase.js";
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
  const { rfid, weight, event_id, bottle_count } = input;
  const storedWeight = normalizeWeightForDb(weight);
  const tokens_earned = calculateTokens(storedWeight);
  const bottleCount = bottle_count ?? 1;
  const now = new Date().toISOString();
  const normalizedEventId = event_id.trim();

  if (!markInflightDeviceEvent(normalizedEventId)) {
    return { status: "DUPLICATE_EVENT" as const };
  }

  const alreadyDone = await wasEventProcessed(normalizedEventId);
  if (alreadyDone) {
    releaseInflightDeviceEvent(normalizedEventId);
    return { status: "DUPLICATE_EVENT" as const };
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
      const updated = await updateUserCountersWithRetry({
        studentId: currentUser.Student_ID,
        rfid,
        tokensEarned: tokens_earned,
        storedWeight,
        bottleCount,
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
        eventId: normalizedEventId,
      });

      await createDeviceNotificationSafe({
        studentId: currentUser.Student_ID,
        type: "TOKEN_ADDED",
        title: "Token added",
        message: buildTokenAddedMessage(tokens_earned, storedWeight),
        metadata: {
          tokensEarned: tokens_earned,
          weight: storedWeight,
          bottleCount,
          eventId: normalizedEventId,
        },
      });

      return {
        status: "SUCCESS" as const,
        name: updated.name,
        weight: storedWeight,
        bottle_count: bottleCount,
        tokens_earned,
        tokens: updated.tokens,
      };
    }

    return { status: "RFID_NOT_REGISTERED" as const };
  } finally {
    releaseInflightDeviceEvent(normalizedEventId);
  }
}
