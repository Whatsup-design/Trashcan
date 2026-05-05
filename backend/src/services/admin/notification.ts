import { supabase } from "../../lib/supabase.js";
import { createNotification, NOTIFICATION_SELECT } from "../shared/notification.js";

type CreateSystemNotificationInput = {
  title: string;
  message: string;
  metadata?: Record<string, unknown> | null;
};

export async function createSystemNotification(input: CreateSystemNotificationInput) {
  return createNotification({
    studentId: null,
    type: "SYSTEM",
    title: input.title,
    message: input.message,
    metadata: input.metadata ?? null,
  });
}

export async function getSystemNotifications() {
  const { data, error } = await supabase
    .from("Notification")
    .select(NOTIFICATION_SELECT)
    .is("Student_ID", null)
    .eq("Notification_Type", "SYSTEM")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    throw error;
  }

  return data ?? [];
}
