import { supabase } from "../../lib/supabase.js";

export async function getActivityLog() {
  const { data, error } = await supabase
    .from("Activity_logs")
    .select("Student_ID, Student_Name, action, tokens, weight, created_at");
  
  if (error) {
    throw new Error("Failed to fetch activity log data");
  }

  return data;
}