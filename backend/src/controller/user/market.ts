import {UserMarketData} from "../../services/user/market.js";

import type { Request, Response } from 'express';

export async function UserMarketController (req: Request, res: Response) {
  try {
    const studentId = Number(req.user?.student_id);

    if (!Number.isFinite(studentId) || studentId <= 0) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const marketData = await UserMarketData(studentId);
    return res.json(marketData);
  } catch (error) {
    console.error("Error fetching market data:", error);
    return res.status(500).json({ message: "Failed to fetch market data" });
  }
}