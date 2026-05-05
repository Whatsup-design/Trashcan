export type UserNotificationResponse = {
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
