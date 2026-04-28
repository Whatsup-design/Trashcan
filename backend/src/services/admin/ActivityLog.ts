import { supabase } from "../../lib/supabase.js";

type StudentIdRow = {
  Student_ID: number | null;
};

export async function getActivityLog() {
  const { data: studentRows, error: studentError } = await supabase
    .from("User")
    .select("Student_ID")
    .eq("role", "student");

  if (studentError) {
    throw new Error("Failed to fetch student list for activity log");
  }

  const studentIds = ((studentRows ?? []) as StudentIdRow[])
    .map((row: StudentIdRow) => Number(row.Student_ID))
    .filter((id: number) => Number.isFinite(id));

  if (studentIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("Activity_logs")
    .select("Student_ID, Student_Name, action, tokens, weight, created_at")
    .in("Student_ID", studentIds);
  
  if (error) {
    throw new Error("Failed to fetch activity log data");
  }

  return data;
}
