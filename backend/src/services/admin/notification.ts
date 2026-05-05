import { createNotification } from "../shared/notification.js";

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
