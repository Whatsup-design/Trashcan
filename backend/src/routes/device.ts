import express from "express";
import { deviceScanController } from "../controller/device/scan.js";
import { deviceConfirmController } from "../controller/device/confirm.js";
import { deviceRegisterController } from "../controller/device/register.js";
import deviceAuthMiddleware from "../middleware/device/deviceAuthMiddleware.js";
import {
  deviceConfirmRateLimit,
  deviceRegisterRateLimit,
  deviceScanRateLimit,
} from "../middleware/rateLimit/limits.js";

const router = express.Router();

router.use(deviceAuthMiddleware);

router.post("/scan", deviceScanRateLimit, deviceScanController);
router.post("/register", deviceRegisterRateLimit, deviceRegisterController);
router.post("/confirm", deviceConfirmRateLimit, deviceConfirmController);

export default router;
