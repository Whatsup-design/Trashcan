import { supabase } from "../../lib/supabase.js";

export type NotificationType =
  | "WELCOME"
  | "TOKEN_ADDED"
  | "TOKEN_EXCHANGED"
  | "REDEEM_USED"
  | "REDEEM_CANCELLED"
  | "REDEEM_EXPIRED"
  | "SYSTEM";

export type CreateNotificationInput = {
  studentId: number | null;
  title: string;
  message: string;
  type: NotificationType;
  metadata?: Record<string, unknown> | null;
};

export const NOTIFICATION_SELECT =
  "Notification_ID, Student_ID, Notification_Title, Notification_Message, Notification_Type, Notification_IsRead, Notification_Metadata, created_at, read_at";

export async function createNotification(input: CreateNotificationInput) {
  const title = input.title.trim();
  const message = input.message.trim();

  if (!title || !message) {
    throw new Error("Notification title and message are required");
  }

  const { data, error } = await supabase
    .from("Notification")
    .insert({
      Student_ID: input.studentId,
      Notification_Title: title,
      Notification_Message: message,
      Notification_Type: input.type,
      Notification_IsRead: false,
      Notification_Metadata: input.metadata ?? null,
    })
    .select(NOTIFICATION_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
