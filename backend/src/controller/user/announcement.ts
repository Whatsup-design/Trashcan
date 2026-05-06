import type { Request, Response } from "express";
import { getUserAnnouncements } from "../../services/user/announcement.js";

export async function UserAnnouncementController(_req: Request, res: Response) {
  try {
    const announcements = await getUserAnnouncements();
    return res.status(200).json(announcements);
  } catch (error) {
    console.error("Error fetching announcement data:", error);
    return res.status(500).json({ message: "Failed to fetch announcements" });
  }
}
