import {getData} from "../../services/admin/data.js";

import type { Request, Response } from 'express';


export async function dataController(req: Request, res: Response) {
  try {
    const data = await getData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}

