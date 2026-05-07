import { supabase } from "../../lib/supabase.js";
import { hashPassword } from "../../utils/bycryto.js";
import { formatNameForPassword } from "../../utils/nameFormat.js";
import {
  createDeviceNotificationSafe,
  type SchoolRow,
  type UserRow,
} from "./shared.js";

type DeviceRegisterInput = {
  rfid: string;
  student_id: number;
};

async function writeDeviceRegisterActivityLog(params: {
  studentId: number;
  studentName: string | null;
}) {
  const { studentId, studentName } = params;

  const { error } = await supabase.from("Activity_logs").insert({
    Student_ID: studentId,
    Student_Name: studentName ?? "Unknown",
    action: "DEVICE_REGISTER",
    tokens: 0,
    weight: 0,
    created_at: new Date().toISOString(),
  });

  if (error) throw error;
}

async function writeDeviceRegisterActivityLogSafe(params: {
  studentId: number;
  studentName: string | null;
}) {
  try {
    await writeDeviceRegisterActivityLog(params);
  } catch (error) {
    console.error("Failed to write device register activity log:", {
      studentId: params.studentId,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

async function createWelcomeNotification(studentId: number, rfid: string) {
  await createDeviceNotificationSafe({
    studentId,
    type: "WELCOME",
    title: "Welcome to Smart Trashcan",
    message: "Your RFID has been registered successfully.",
    metadata: {
      rfid,
    },
  });
}

export async function deviceRegister(input: DeviceRegisterInput) {
  const { rfid, student_id } = input;
  const now = new Date().toISOString();

  const { data: existingRfidUser, error: existingRfidError } = await supabase
    .from("User")
    .select("Student_ID, RFID_ID, Student_FullNameT, Student_Tokens")
    .eq("RFID_ID", rfid)
    .maybeSingle();

  if (existingRfidError) {
    throw existingRfidError;
  }

  if (existingRfidUser) {
    const user = existingRfidUser as Pick<
      UserRow,
      "Student_ID" | "RFID_ID" | "Student_FullNameT" | "Student_Tokens"
    >;

    return {
      status: "RFID_ALREADY_REGISTERED" as const,
      student_id: user.Student_ID,
      name: user.Student_FullNameT,
      tokens: user.Student_Tokens ?? 0,
    };
  }

  const { data: existingStudentUser, error: existingStudentError } = await supabase
    .from("User")
    .select("Student_ID, RFID_ID, Student_FullNameT, Student_Tokens")
    .eq("Student_ID", student_id)
    .maybeSingle();

  if (existingStudentError) {
    throw existingStudentError;
  }

  const studentUser = existingStudentUser as Pick<
    UserRow,
    "Student_ID" | "RFID_ID" | "Student_FullNameT" | "Student_Tokens"
  > | null;

  if (studentUser) {
    if (studentUser.RFID_ID && studentUser.RFID_ID !== rfid) {
      return { status: "ALREADY_BOUND" as const };
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from("User")
      .update({
        RFID_ID: rfid,
        updated_at: now,
      })
      .eq("Student_ID", student_id)
      .is("RFID_ID", null)
      .select("Student_ID, Student_FullNameT, Student_Tokens")
      .maybeSingle();

    if (updateError) {
      throw updateError;
    }

    if (!updatedUser) {
      return { status: "ALREADY_BOUND" as const };
    }

    const savedUser = updatedUser as Pick<
      UserRow,
      "Student_ID" | "Student_FullNameT" | "Student_Tokens"
    >;

    await writeDeviceRegisterActivityLogSafe({
      studentId: savedUser.Student_ID,
      studentName: savedUser.Student_FullNameT,
    });

    await createWelcomeNotification(savedUser.Student_ID, rfid);

    return {
      status: "SUCCESS" as const,
      student_id: savedUser.Student_ID,
      name: savedUser.Student_FullNameT,
      tokens: savedUser.Student_Tokens ?? 0,
    };
  }

  const { data: schoolStudent, error: schoolError } = await supabase
    .from("School_Data")
    .select(
      "Student_ID, Student_FullNameT, Student_FullNameE, Student_NickNameT, Student_NickNameE, Birth"
    )
    .eq("Student_ID", student_id)
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
      Student_Tokens: 0,
      Student_Bottles: 0,
      Student_weight: 0,
      password_hash: passwordHash,
      role: "student",
      status: "active",
      created_at: now,
      updated_at: now,
      last_login_at: null,
    })
    .select("Student_ID, Student_FullNameT, Student_Tokens")
    .single();

  if (insertError) {
    throw insertError;
  }

  const savedStudent = insertedUser as Pick<
    UserRow,
    "Student_ID" | "Student_FullNameT" | "Student_Tokens"
  >;

  await writeDeviceRegisterActivityLogSafe({
    studentId: savedStudent.Student_ID,
    studentName: savedStudent.Student_FullNameT,
  });

  await createWelcomeNotification(savedStudent.Student_ID, rfid);

  return {
    status: "SUCCESS" as const,
    student_id: savedStudent.Student_ID,
    name: savedStudent.Student_FullNameT,
    tokens: savedStudent.Student_Tokens ?? 0,
  };
}
