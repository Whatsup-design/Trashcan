import type { Request, Response } from "express";
import {
  createAnnouncement,
  getAnnouncements,
} from "../../services/admin/announcement.js";

export async function getAnnouncementsController(_req: Request, res: Response) {
  try {
    const announcements = await getAnnouncements();
    return res.status(200).json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return res.status(500).json({ message: "Failed to fetch announcements" });
  }
}

export async function createAnnouncementController(req: Request, res: Response) {
  try {
    const announcement = await createAnnouncement({
      title: String(req.body?.title ?? ""),
      message: String(req.body?.message ?? ""),
      headerType: String(req.body?.headerType ?? "ANNOUNCEMENT"),
    });

    return res.status(201).json(announcement);
  } catch (error) {
    console.error("Error creating announcement:", error);

    if (
      error instanceof Error &&
      [
        "Announcement title and message are required",
        "Invalid announcement header type",
      ].includes(error.message)
    ) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Failed to create announcement" });
  }
}
