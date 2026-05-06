import { supabase } from "../../lib/supabase.js";
import { hashPassword } from "../../utils/bycryto.js";
import { formatNameForPassword } from "../../utils/nameFormat.js";
import {
  buildTokenAddedMessage,
  createDeviceNotificationSafe,
  type SchoolRow,
  type UserRow,
  updateUserCountersWithRetry,
  writeDeviceActivityLog,
} from "./shared.js";

type RegisterForConfirmInput = {
  rfid: string;
  studentId: number;
  tokensEarned: number;
  storedWeight: number;
  now: string;
  normalizedEventId?: string;
};

export async function registerOrBindStudentForConfirm(input: RegisterForConfirmInput) {
  const { rfid, studentId, tokensEarned, storedWeight, now, normalizedEventId } = input;

  const { data: studentUser, error: studentUserError } = await supabase
    .from("User")
    .select(
      "Student_ID, RFID_ID, Student_FullNameT, Student_Tokens, Student_weight, Student_Bottles"
    )
    .eq("Student_ID", studentId)
    .maybeSingle();

  if (studentUserError) {
    throw studentUserError;
  }

  const bindTargetUser = studentUser as UserRow | null;

  if (bindTargetUser) {
    if (bindTargetUser.RFID_ID && bindTargetUser.RFID_ID !== rfid) {
      return { status: "ALREADY_BOUND" as const };
    }

    const updated = await updateUserCountersWithRetry({
      studentId,
      rfid,
      tokensEarned,
      storedWeight,
      now,
      allowBindRfid: true,
    });

    if (updated.status !== "SUCCESS") {
      return { status: updated.status };
    }

    await writeDeviceActivityLog({
      studentId,
      studentName: updated.name ?? null,
      tokensEarned,
      weight: storedWeight,
      ...(normalizedEventId ? { eventId: normalizedEventId } : {}),
    });

    await createDeviceNotificationSafe({
      studentId,
      type: "WELCOME",
      title: "Welcome to Smart Trashcan",
      message: "Your RFID has been registered successfully.",
      metadata: {
        rfid,
        eventId: normalizedEventId ?? null,
      },
    });

    await createDeviceNotificationSafe({
      studentId,
      type: "TOKEN_ADDED",
      title: "Token added",
      message: buildTokenAddedMessage(tokensEarned, storedWeight),
      metadata: {
        tokensEarned,
        weight: storedWeight,
        eventId: normalizedEventId ?? null,
      },
    });

    return {
      status: "SUCCESS" as const,
      name: updated.name,
      weight: storedWeight,
      tokens_earned: tokensEarned,
      tokens: updated.tokens,
    };
  }

  const { data: schoolStudent, error: schoolError } = await supabase
    .from("School_Data")
    .select(
      "Student_ID, Student_FullNameT, Student_FullNameE, Student_NickNameT, Student_NickNameE, Birth"
    )
    .eq("Student_ID", studentId)
    .maybeSingle();

  if (schoolError) {
    throw schoolError;
  }

  const schoolUser = schoolStudent as SchoolRow | null;

  if (!schoolUser) {
    return { status: "INVALID_STUDENT_ID" as const };
  }

  const cleanName = formatNameForPassword(schoolUser.Student_FullNameE ?? "");
  const rawPassword = `@${schoolUser.Student_ID}${cleanName}`;
  const passwordHash = await hashPassword(rawPassword);

  const { data: insertedUser, error: insertError } = await supabase
    .from("User")
    .insert({
      Student_ID: schoolUser.Student_ID,
      RFID_ID: rfid,
      Student_FullNameT: schoolUser.Student_FullNameT,
      Student_FullNameE: schoolUser.Student_FullNameE,
      Student_NickNameT: schoolUser.Student_NickNameT,
      Student_NickNameE: schoolUser.Student_NickNameE,
      birth: schoolUser.Birth,
      Student_Email: null,
      Student_Tokens: tokensEarned,
      Student_Bottles: 1,
      Student_weight: storedWeight,
      password_hash: passwordHash,
      role: "student",
      status: "active",
      created_at: now,
      updated_at: now,
      last_login_at: null,
    })
    .select("Student_FullNameT, Student_Tokens")
    .single();

  if (insertError) {
    throw insertError;
  }

  const savedStudent = insertedUser as Pick<UserRow, "Student_FullNameT" | "Student_Tokens">;

  await writeDeviceActivityLog({
    studentId: schoolUser.Student_ID,
    studentName: savedStudent.Student_FullNameT ?? null,
    tokensEarned,
    weight: storedWeight,
    ...(normalizedEventId ? { eventId: normalizedEventId } : {}),
  });

  await createDeviceNotificationSafe({
    studentId: schoolUser.Student_ID,
    type: "WELCOME",
    title: "Welcome to Smart Trashcan",
    message: "Your account has been created and your RFID is ready to use.",
    metadata: {
      rfid,
      eventId: normalizedEventId ?? null,
    },
  });

  await createDeviceNotificationSafe({
    studentId: schoolUser.Student_ID,
    type: "TOKEN_ADDED",
    title: "Token added",
    message: buildTokenAddedMessage(tokensEarned, storedWeight),
    metadata: {
      tokensEarned,
      weight: storedWeight,
      eventId: normalizedEventId ?? null,
    },
  });

  return {
    status: "SUCCESS" as const,
    name: savedStudent.Student_FullNameT,
    weight: storedWeight,
    tokens_earned: tokensEarned,
    tokens: savedStudent.Student_Tokens ?? tokensEarned,
  };
}
