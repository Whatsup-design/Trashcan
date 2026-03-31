import express from 'express';
import { dashboardController } from '../controller/admin/dashboard.js';
import { dataController } from '../controller/admin/data.js';
import {activityLogController} from "../controller/admin/activityLog.js";


const router = express.Router();

router.get('/Dashboard', dashboardController);

router.get('/Data', dataController);

router.get("/ActivityLog", activityLogController);


export default router;


