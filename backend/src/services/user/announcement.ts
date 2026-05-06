import { supabase } from "../../lib/supabase.js";

const USER_ANNOUNCEMENT_SELECT = [
  "Announcement_ID",
  "Announcement_Title",
  "Announcement_Message",
  "Announcement_HeaderType",
  "created_at",
].join(", ");

export async function getUserAnnouncements() {
  const { data, error } = await supabase
    .from("Announcement")
    .select(USER_ANNOUNCEMENT_SELECT)
    .eq("Announcement_IsActive", true)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    throw error;
  }

  return data ?? [];
}
