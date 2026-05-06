import { supabase } from "../../lib/supabase.js";
import type { UserRow } from "./shared.js";

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
    return { status: "NOT_FOUND" as const };
  }

  return {
    status: "FOUND" as const,
    name: user.Student_FullNameT,
    tokens: user.Student_Tokens ?? 0,
  };
}

export async function deviceAuthentication(rfid: string) {
  return deviceScan(rfid);
}
