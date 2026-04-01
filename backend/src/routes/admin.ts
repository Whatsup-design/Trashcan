import express from 'express';
import { dashboardController } from '../controller/admin/dashboard.js';
import { dataController } from '../controller/admin/data.js';
import {activityLogController} from "../controller/admin/activityLog.js";
import {TokensController} from "../controller/admin/tokenMarket.js";


const router = express.Router();
// ── ข้อมูลสำหรับหน้า Dashboard ───────────────────────────────
router.get('/Dashboard', dashboardController);

// ── ข้อมูลสำหรับหน้า Data  ───────────────────────────────
router.get('/Data', dataController);

// ── ข้อมูลสำหรับหน้า Activity Log ───────────────────────────────
router.get("/ActivityLog", activityLogController);

router.get("/Tokens", TokensController);


export default router;


