import type { Request, Response } from "express";
import {
  createSystemNotification,
  getSystemNotifications,
} from "../../services/admin/notification.js";

export async function getSystemNotificationsController(_req: Request, res: Response) {
  try {
    const notifications = await getSystemNotifications();
    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching system notifications:", error);
    return res.status(500).json({ message: "Failed to fetch system notifications" });
  }
}

export async function createSystemNotificationController(req: Request, res: Response) {
  try {
    const notification = await createSystemNotification({
      title: String(req.body?.title ?? ""),
      message: String(req.body?.message ?? ""),
      metadata:
        req.body?.metadata && typeof req.body.metadata === "object"
          ? req.body.metadata
          : null,
    });

    return res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating system notification:", error);

    if (
      error instanceof Error &&
      error.message === "Notification title and message are required"
    ) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Failed to create notification" });
  }
}
