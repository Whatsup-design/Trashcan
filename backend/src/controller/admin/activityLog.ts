import {getActivityLog} from "../../services/admin/ActivityLog.js";

import type { Request, Response } from 'express';


export async function activityLogController(req: Request, res: Response) {
  try {
    const data = await getActivityLog();
    res.json(data);
  } catch (error) {
    console.error('Error fetching activity log data:', error);
    res.status(500).json({ error: 'Failed to fetch activity log data' });
  }
}