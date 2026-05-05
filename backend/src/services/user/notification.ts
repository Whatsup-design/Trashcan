import { supabase } from "../../lib/supabase.js";
import { NOTIFICATION_SELECT } from "../shared/notification.js";

export type UserNotificationRow = {
  Notification_ID: number;
  Student_ID: number | null;
  Notification_Title: string;
  Notification_Message: string;
  Notification_Type: string;
  Notification_IsRead: boolean;
  Notification_Metadata: Record<string, unknown> | null;
  created_at: string;
  read_at: string | null;
};

export async function getUserNotifications(studentId: number) {
  const { data, error } = await supabase
    .from("Notification")
    .select(NOTIFICATION_SELECT)
    .or(`Student_ID.eq.${studentId},Student_ID.is.null`)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as UserNotificationRow[] | null) ?? [];
}
