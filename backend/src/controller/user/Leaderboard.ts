import {getUserLeaderboardData} from "../../services/user/Leaderboard.js";

import type { Request, Response } from 'express';

export async function UserLeaderboardController(req: Request, res: Response) {
  try {
    const studentId = Number(req.user?.student_id);

    if (!Number.isFinite(studentId) || studentId <= 0) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const leaderboardData = await getUserLeaderboardData(studentId);
    return res.json(leaderboardData);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);

    if (error instanceof Error && error.message === "Leaderboard user not found") {
      return res.status(404).json({ message: "Leaderboard user not found" });
    }

    return res.status(500).json({ message: "Failed to fetch leaderboard data" });
  }
}
