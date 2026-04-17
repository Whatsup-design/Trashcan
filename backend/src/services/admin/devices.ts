import { supabase } from "../../lib/supabase.js";
import { hashPassword } from "../../utils/bycryto.js";

type DeviceConfirmInput = {
  rfid: string;
  student_id?: number;
  weight: number;
  tokens_earned: number;
  password?: string;
};

type UserRow = {
  Student_ID: number;
  RFID_ID: string | null;
  Student_FullNameT: string | null;
  Student_Tokens: number | null;
  Student_weight: number | null;
  Student_Bottles: number | null;
  Password_hash: string | null;
  
};

type SchoolRow = {
  Student_ID: number;
  Student_FullNameT: string | null;
  Student_FullNameE: string | null;
  Student_NickNameT: string | null;
  Student_NickNameE: string | null;
  Birth: string | null;
};

function normalizeWeightForDb(weight: number) {
  if (!Number.isFinite(weight) || weight < 0) {
    return 0;
  }

  return Math.round(weight);
}

export async function deviceScan(rfid: string) {
  const { data, error } = await supabase
    .from("User")
    .select("Student_ID, RFID_ID, Student_FullNameT, Student_Tokens")
    .eq("RFID_ID", rfid)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const user = data as Pick<
    UserRow,
    "Student_ID" | "RFID_ID" | "Student_FullNameT" | "Student_Tokens"
  > | null;

  if (!user) {
    return { status: "NOT_FOUND" };
  }

  return {
    status: "FOUND",
    name: user.Student_FullNameT,
    tokens: user.Student_Tokens ?? 0,
  };
}

export async function deviceConfirm(input: DeviceConfirmInput) {
  const { rfid, student_id, weight, tokens_earned } = input;
  const storedWeight = normalizeWeightForDb(weight);
  const now = new Date().toISOString();

  // --------------------------------------------------
  // 1. Check existing RFID first
  // --------------------------------------------------
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

  // --------------------------------------------------
  // 2. Existing RFID user -> update token / weight / bottle
  // --------------------------------------------------
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
        updated_at: now,
      })
      .eq("Student_ID", currentUser.Student_ID)
      .select("Student_FullNameT, Student_Tokens")
      .single();

    if (updateError) {
      throw updateError;
    }

    const savedUser = updatedUser as Pick<
      UserRow,
      "Student_FullNameT" | "Student_Tokens"
    >;

    return {
      status: "SUCCESS",
      name: savedUser.Student_FullNameT,
      weight: storedWeight,
      tokens_earned,
      tokens: savedUser.Student_Tokens ?? nextTokens,
    };
  }

  // --------------------------------------------------
  // 3. RFID not found -> student_id is required
  // --------------------------------------------------
  if (typeof student_id !== "number") {
    return { status: "INVALID_STUDENT_ID" };
  }

  // --------------------------------------------------
  // 4. Check if student already exists in User table
  // --------------------------------------------------
  const { data: studentUser, error: studentUserError } = await supabase
    .from("User")
    .select(
      "Student_ID, RFID_ID, Student_FullNameT, Student_Tokens, Student_weight, Student_Bottles"
    )
    .eq("Student_ID", student_id)
    .maybeSingle();

  if (studentUserError) {
    throw studentUserError;
  }

  const bindTargetUser = studentUser as UserRow | null;

  // --------------------------------------------------
  // 5. Existing student row -> bind RFID and update counters
  // --------------------------------------------------
  if (bindTargetUser) {
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
        updated_at: now,
      })
      .eq("Student_ID", student_id)
      .select("Student_FullNameT, Student_Tokens")
      .single();

    if (bindError) {
      throw bindError;
    }

    const savedStudent = updatedStudent as Pick<
      UserRow,
      "Student_FullNameT" | "Student_Tokens"
    >;

    return {
      status: "SUCCESS",
      name: savedStudent.Student_FullNameT,
      weight: storedWeight,
      tokens_earned,
      tokens: savedStudent.Student_Tokens ?? nextTokens,
    };
  }

  // --------------------------------------------------
  // 6. Student not in User table -> look up in School_Data
  // --------------------------------------------------
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
    return { status: "INVALID_STUDENT_ID" };
  }



  // --------------------------------------------------
  // 7. Create new User row from School_Data + hardware data
  // --------------------------------------------------
  // generate a default password using the requested pattern: @[student_ID][FullName]
  const rawPassword = `@${schoolUser.Student_ID}[${
    schoolUser.Student_FullNameE ?? ""
  }]`;
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
      Student_Tokens: tokens_earned,
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

  const savedStudent = insertedUser as Pick<
    UserRow,
    "Student_FullNameT" | "Student_Tokens"
  >;

  return {
    status: "SUCCESS",
    name: savedStudent.Student_FullNameT,
    weight: storedWeight,
    tokens_earned,
    tokens: savedStudent.Student_Tokens ?? tokens_earned,
    password: rawPassword,
  };
}
