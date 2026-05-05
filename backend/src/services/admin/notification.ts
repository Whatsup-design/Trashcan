import { createNotification } from "../shared/notification.js";

type CreateSystemNotificationInput = {
  title: string;
  message: string;
  metadata?: Record<string, unknown> | null;
};

export async function createSystemNotification(input: CreateSystemNotificationInput) {
  return createNotification({
    studentId: null,
    title: input.title,
    message: input.message,
    type: "SYSTEM",
    metadata: input.metadata ?? null,
  });
}
