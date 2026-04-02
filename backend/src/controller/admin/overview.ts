import { getOverview } from "../../services/admin/overview.js";

import type { Request, Response } from 'express';


export async function overviewController(req: Request, res: Response) {
  try {
    const data = await getOverview();
    res.json(data);
  } catch (error) {
    console.error('Error fetching overview data:', error);
    res.status(500).json({ error: 'Failed to fetch overview data' });
  }
}