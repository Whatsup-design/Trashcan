import { supabase } from "../../lib/supabase.js";

type CreateSystemNotificationInput = {
  title: string;
  message: string;
  metadata?: Record<string, unknown> | null;
};

export async function createSystemNotification(input: CreateSystemNotificationInput) {
  const title = input.title.trim();
  const message = input.message.trim();

  if (!title || !message) {
    throw new Error("Notification title and message are required");
  }

  const { data, error } = await supabase
    .from("Notification")
    .insert({
      Student_ID: null,
      Notification_Title: title,
      Notification_Message: message,
      Notification_Type: "SYSTEM",
      Notification_IsRead: false,
      Notification_Metadata: input.metadata ?? null,
    })
    .select(
      "Notification_ID, Student_ID, Notification_Title, Notification_Message, Notification_Type, Notification_IsRead, Notification_Metadata, created_at, read_at"
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
}
