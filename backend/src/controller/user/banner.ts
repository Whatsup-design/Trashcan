import type { Request, Response } from "express";
import { getUserBannerData } from "../../services/user/banner.js";

export async function UserBannerController(req: Request, res: Response) {
  try {
    const studentId = Number(req.user?.student_id);

    if (!Number.isFinite(studentId) || studentId <= 0) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const bannerData = await getUserBannerData();
    return res.json(bannerData);
  } catch (error) {
    console.error("Error fetching banner data:", error);
    return res.status(500).json({ message: "Failed to fetch banner data" });
  }
}
