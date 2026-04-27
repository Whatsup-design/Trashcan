import { getUserDashboardData } from "../../services/user/dashboard.js";

import type { Request, Response } from 'express';


export async function UserDashboardController(req: Request, res: Response) {
  try {
    const studentId = Number(req.user?.student_id);

    if (!Number.isFinite(studentId) || studentId <= 0) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const data = await getUserDashboardData(studentId);
    res.json(data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    if (error instanceof Error && error.message === "User dashboard data not found") {
      return res.status(404).json({ message: "User dashboard data not found" });
    }

    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
}
