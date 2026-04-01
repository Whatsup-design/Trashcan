import {getDashboardData} from "../../services/admin/dashboard.js";

import type { Request, Response } from 'express';


export async function TokensController(req: Request, res: Response) {
  try {
    const data = await getDashboardData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
}