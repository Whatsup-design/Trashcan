import { supabase } from "../../lib/supabase.js";

type DeviceConfirmInput = {
  rfid: string;
  student_id?: number;
  weight: number;
  tokens_earned: number;
};

type UserRow = {
  Student_ID: number;
  RFID_ID: string | null;
  Student_Name: string | null;
  Student_Tokens: number | null;
  Student_weight: number | null;
  Student_Bottles: number | null;
};

function normalizeWeightForDb(weight: number) {
  return Math.round(weight);
}

export async function deviceScan(rfid: string) {
  const { data, error } = await supabase
    .from("User")
    .select("Student_ID, RFID_ID, Student_Name, Student_Tokens")
    .eq("RFID_ID", rfid)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const user = data as Pick<
    UserRow,
    "Student_ID" | "RFID_ID" | "Student_Name" | "Student_Tokens"
  > | null;

  if (!user) {
    return { status: "NOT_FOUND" };
  }

  return {
    status: "FOUND",
    name: user.Student_Name,
    tokens: user.Student_Tokens ?? 0,
  };
}

export async function deviceConfirm(input: DeviceConfirmInput) {
  const { rfid, student_id, weight, tokens_earned } = input;
  const storedWeight = normalizeWeightForDb(weight);

  const { data: existingRfidUser, error: existingRfidUserError } = await supabase
    .from("User")
    .select(
      "Student_ID, RFID_ID, Student_Name, Student_Tokens, Student_weight, Student_Bottles"
    )
    .eq("RFID_ID", rfid)
    .maybeSingle();

  if (existingRfidUserError) {
    throw existingRfidUserError;
  }

  const currentUser = existingRfidUser as UserRow | null;

  if (currentUser) {
    const nextTokens = (currentUser.Student_Tokens ?? 0) + tokens_earned;
    const nextWeight = (currentUser.Student_weight ?? 0) + storedWeight;
    const nextBottles = (currentUser.Student_Bottles ?? 0) + 1;

    const { data: updatedUser, error: updateError } = await supabase
      .from("User")
      .update({
        Student_Tokens: nextTokens,
        Student_weight: nextWeight,
        Student_Bottles: nextBottles,
        updated_at: new Date().toISOString(),
      })
      .eq("Student_ID", currentUser.Student_ID)
      .select("Student_Name, Student_Tokens")
      .single();

    if (updateError) {
      throw updateError;
    }

    const savedUser = updatedUser as Pick<UserRow, "Student_Name" | "Student_Tokens">;

    return {
      status: "SUCCESS",
      name: savedUser.Student_Name,
      weight: storedWeight,
      tokens_earned,
      tokens: savedUser.Student_Tokens ?? nextTokens,
    };
  }

  if (typeof student_id !== "number") {
    return { status: "INVALID_STUDENT_ID" };
  }

  const { data: studentUser, error: studentUserError } = await supabase
    .from("User")
    .select(
      "Student_ID, RFID_ID, Student_Name, Student_Tokens, Student_weight, Student_Bottles"
    )
    .eq("Student_ID", student_id)
    .maybeSingle();

  if (studentUserError) {
    throw studentUserError;
  }

  const bindTargetUser = studentUser as UserRow | null;

  if (!bindTargetUser) {
    return { status: "INVALID_STUDENT_ID" };
  }

  if (bindTargetUser.RFID_ID && bindTargetUser.RFID_ID !== rfid) {
    return { status: "ALREADY_BOUND" };
  }

  const nextTokens = (bindTargetUser.Student_Tokens ?? 0) + tokens_earned;
  const nextWeight = (bindTargetUser.Student_weight ?? 0) + storedWeight;
  const nextBottles = (bindTargetUser.Student_Bottles ?? 0) + 1;

  const { data: updatedStudent, error: bindError } = await supabase
    .from("User")
    .update({
      RFID_ID: rfid,
      Student_Tokens: nextTokens,
      Student_weight: nextWeight,
      Student_Bottles: nextBottles,
      updated_at: new Date().toISOString(),
    })
    .eq("Student_ID", student_id)
    .select("Student_Name, Student_Tokens")
    .single();

  if (bindError) {
    throw bindError;
  }

  const savedStudent = updatedStudent as Pick<
    UserRow,
    "Student_Name" | "Student_Tokens"
  >;

  return {
    status: "SUCCESS",
    name: savedStudent.Student_Name,
    weight: storedWeight,
    tokens_earned,
    tokens: savedStudent.Student_Tokens ?? nextTokens,
  };
}
