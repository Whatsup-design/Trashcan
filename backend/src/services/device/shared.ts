import { supabase } from "../../lib/supabase.js";
import { createNotification } from "../shared/notification.js";

export type DeviceConfirmInput = {
  rfid: string;
  student_id?: number;
  weight: number;
  event_id?: string;
};

export type UserRow = {
  Student_ID: number;
  RFID_ID: string | null;
  Student_FullNameT: string | null;
  Student_Tokens: number | null;
  Student_weight: number | null;
  Student_Bottles: number | null;
  Password_hash: string | null;
  updated_at?: string | null;
};

export type SchoolRow = {
  Student_ID: number;
  Student_FullNameT: string | null;
  Student_FullNameE: string | null;
  Student_NickNameT: string | null;
  Student_NickNameE: string | null;
  Birth: string | null;
};

export function normalizeWeightForDb(weight: number) {
  if (!Number.isFinite(weight) || weight < 0) {
    return 0;
  }

  return Math.round(weight);
}

export function calculateTokens(weightKg: number) {
  if (!Number.isFinite(weightKg) || weightKg < 2) {
    return 0;
  }

  return Math.min(Math.floor(weightKg / 2), 10);
}

const inflightDeviceEvents = new Set<string>();

export function buildEventAction(eventId?: string) {
  if (!eventId) return "DEVICE_CONFIRM";
  return `DEVICE_CONFIRM:${eventId}`;
}

export function markInflightDeviceEvent(eventId: string) {
  if (inflightDeviceEvents.has(eventId)) {
    return false;
  }

  inflightDeviceEvents.add(eventId);
  return true;
}

export function releaseInflightDeviceEvent(eventId?: string) {
  if (eventId) {
    inflightDeviceEvents.delete(eventId);
  }
}

export async function wasEventProcessed(eventId: string) {
  const action = buildEventAction(eventId);
  const { data, error } = await supabase
    .from("Activity_logs")
    .select("action")
    .eq("action", action)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

export async function writeDeviceActivityLog(params: {
  studentId: number;
  studentName: string | null;
  tokensEarned: number;
  weight: number;
  eventId?: string;
}) {
  const { studentId, studentName, tokensEarned, weight, eventId } = params;

  const { error } = await supabase.from("Activity_logs").insert({
    Student_ID: studentId,
    Student_Name: studentName ?? "Unknown",
    action: buildEventAction(eventId),
    tokens: tokensEarned,
    weight,
    created_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function createDeviceNotificationSafe(params: {
  studentId: number;
  type: "WELCOME" | "TOKEN_ADDED";
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await createNotification({
      studentId: params.studentId,
      type: params.type,
      title: params.title,
      message: params.message,
      metadata: params.metadata ?? null,
    });
  } catch (error) {
    console.error("Failed to create device notification:", error);
  }
}

export function buildTokenAddedMessage(tokensEarned: number, weight: number) {
  return `You earned ${tokensEarned} token${tokensEarned === 1 ? "" : "s"} from ${weight} kg.`;
}

export async function updateUserCountersWithRetry(params: {
  studentId: number;
  rfid: string;
  tokensEarned: number;
  storedWeight: number;
  now: string;
  allowBindRfid: boolean;
}) {
  const { studentId, rfid, tokensEarned, storedWeight, now, allowBindRfid } = params;
  const maxRetries = 5;

  for (let attempt = 0; attempt < maxRetries; attempt += 1) {
    const { data: latestUser, error: readError } = await supabase
      .from("User")
      .select(
        "Student_ID, RFID_ID, Student_FullNameT, Student_Tokens, Student_weight, Student_Bottles, updated_at"
      )
      .eq("Student_ID", studentId)
      .maybeSingle();

    if (readError) throw readError;
    const user = latestUser as UserRow | null;
    if (!user) return { status: "INVALID_STUDENT_ID" as const };

    if (user.RFID_ID && user.RFID_ID !== rfid) {
      return { status: "ALREADY_BOUND" as const };
    }

    const nextTokens = (user.Student_Tokens ?? 0) + tokensEarned;
    const nextWeight = (user.Student_weight ?? 0) + storedWeight;
    const nextBottles = (user.Student_Bottles ?? 0) + 1;

    let query = supabase
      .from("User")
      .update({
        ...(allowBindRfid ? { RFID_ID: rfid } : {}),
        Student_Tokens: nextTokens,
        Student_weight: nextWeight,
        Student_Bottles: nextBottles,
        updated_at: now,
      })
      .eq("Student_ID", studentId);

    if (user.updated_at) {
      query = query.eq("updated_at", user.updated_at);
    } else {
      query = query.is("updated_at", null);
    }

    const { data: updatedUser, error: updateError } = await query
      .select("Student_FullNameT, Student_Tokens")
      .maybeSingle();

    if (updateError) throw updateError;

    if (updatedUser) {
      const savedUser = updatedUser as Pick<UserRow, "Student_FullNameT" | "Student_Tokens">;
      return {
        status: "SUCCESS" as const,
        name: savedUser.Student_FullNameT,
        tokens: savedUser.Student_Tokens ?? nextTokens,
      };
    }
  }

  return { status: "RETRY_CONFLICT" as const };
}
