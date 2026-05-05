import { supabase } from "../../lib/supabase.js";
import { hashPassword } from "../../utils/bycryto.js";
import { formatNameForPassword } from "../../utils/nameFormat.js";
import { createNotification } from "../shared/notification.js";


//This is type declaration
type DeviceConfirmInput = {
  rfid: string;
  student_id?: number;
  weight: number;
  
  event_id?: string;
};

type UserRow = {
  Student_ID: number;
  RFID_ID: string | null;
  Student_FullNameT: string | null;
  Student_Tokens: number | null;
  Student_weight: number | null;
  Student_Bottles: number | null;
  Password_hash: string | null;
  updated_at?: string | null;
};

type SchoolRow = {
  Student_ID: number;
  Student_FullNameT: string | null;
  Student_FullNameE: string | null;
  Student_NickNameT: string | null;
  Student_NickNameE: string | null;
  Birth: string | null;
};

//Validation and normalization for weight input from device
function normalizeWeightForDb(weight: number) {
  if (!Number.isFinite(weight) || weight < 0) {
    return 0;
  }

  return Math.round(weight);
}

function calculateTokens(weightKg: number) {
  if (!Number.isFinite(weightKg) || weightKg < 2) {
    return 0;
  }

  return Math.min(Math.floor(weightKg / 2), 10);
}

//Activiy Log action part

// In-memory set to track inflight events and prevent duplicate processing
const inflightDeviceEvents = new Set<string>();

//create Event action for Activity_logs
function buildEventAction(eventId?: string) {
  if (!eventId) return "DEVICE_CONFIRM";
  return `DEVICE_CONFIRM:${eventId}`;
}

async function wasEventProcessed(eventId: string) {
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

async function writeDeviceActivityLog(params: {
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

//end of ActivityLog action par

async function createDeviceNotificationSafe(params: {
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

function buildTokenAddedMessage(tokensEarned: number, weight: number) {
  return `You earned ${tokensEarned} token${tokensEarned === 1 ? "" : "s"} from ${weight} kg.`;
}

// This function attempts to update the user's counters with optimistic concurrency control.
async function updateUserCountersWithRetry(params: {
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
//Device scan main function
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


//Device Confirm main funciton`
export async function deviceConfirm(input: DeviceConfirmInput) {
  const { rfid, student_id, weight, event_id } = input;
  const storedWeight = normalizeWeightForDb(weight);
  const tokens_earned = calculateTokens(weight);
  const now = new Date().toISOString();
  const normalizedEventId = event_id?.trim() || undefined;

  if (normalizedEventId) {
    if (inflightDeviceEvents.has(normalizedEventId)) {
      return { status: "DUPLICATE_EVENT" };
    }
    inflightDeviceEvents.add(normalizedEventId);

    const alreadyDone = await wasEventProcessed(normalizedEventId);
    if (alreadyDone) {
      inflightDeviceEvents.delete(normalizedEventId);
      return { status: "DUPLICATE_EVENT" };
    }
  }

  try {

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
    if (
      typeof student_id === "number" &&
      student_id !== currentUser.Student_ID
    ) {
      console.warn("deviceConfirm RFID/student mismatch", {
        rfid,
        scanned_student_id: student_id,
        bound_student_id: currentUser.Student_ID,
      });
      return { status: "RFID_STUDENT_MISMATCH" };
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
      status: "SUCCESS",
      name: updated.name,
      weight: storedWeight,
      tokens_earned,
      tokens: updated.tokens,
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

    const updated = await updateUserCountersWithRetry({
      studentId: student_id,
      rfid,
      tokensEarned: tokens_earned,
      storedWeight,
      now,
      allowBindRfid: true,
    });

    if (updated.status !== "SUCCESS") {
      return { status: updated.status };
    }

    await writeDeviceActivityLog({
      studentId: student_id,
      studentName: updated.name ?? null,
      tokensEarned: tokens_earned,
      weight: storedWeight,
      ...(normalizedEventId ? { eventId: normalizedEventId } : {}),
    });

    await createDeviceNotificationSafe({
      studentId: student_id,
      type: "WELCOME",
      title: "Welcome to Smart Trashcan",
      message: "Your RFID has been registered successfully.",
      metadata: {
        rfid,
        eventId: normalizedEventId ?? null,
      },
    });

    await createDeviceNotificationSafe({
      studentId: student_id,
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
      status: "SUCCESS",
      name: updated.name,
      weight: storedWeight,
      tokens_earned,
      tokens: updated.tokens,
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
  // generate a default password using the requested pattern: @<studentID><Name>
  // format the full name to remove honorifics and punctuation
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

  await writeDeviceActivityLog({
    studentId: schoolUser.Student_ID,
    studentName: savedStudent.Student_FullNameT ?? null,
    tokensEarned: tokens_earned,
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
    message: buildTokenAddedMessage(tokens_earned, storedWeight),
    metadata: {
      tokensEarned: tokens_earned,
      weight: storedWeight,
      eventId: normalizedEventId ?? null,
    },
  });

  return {
    status: "SUCCESS",
    name: savedStudent.Student_FullNameT,
    weight: storedWeight,
    tokens_earned,
    tokens: savedStudent.Student_Tokens ?? tokens_earned,
  };
  } finally {
    if (normalizedEventId) {
      inflightDeviceEvents.delete(normalizedEventId);
    }
  }
}
