import type { Request, Response } from "express";
import { getUserNotifications } from "../../services/user/notification.js";

function getStudentId(req: Request) {
  const studentId = Number(req.user?.student_id);

  if (!Number.isFinite(studentId) || studentId <= 0) {
    return null;
  }

  return studentId;
}

export async function UserNotificationController(req: Request, res: Response) {
  try {
    const studentId = getStudentId(req);

    if (studentId === null) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const notifications = await getUserNotifications(studentId);
    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notification data:", error);
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
}
