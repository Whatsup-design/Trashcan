import express from "express";
import {
  deviceAuthenticationController,
  deviceScanController,
} from "../controller/device/scan.js";
import { deviceConfirmController } from "../controller/device/confirm.js";
import deviceAuthMiddleware from "../middleware/device/deviceAuthMiddleware.js";
import {
  deviceConfirmRateLimit,
  deviceScanRateLimit,
} from "../middleware/rateLimit/limits.js";

const router = express.Router();

router.use(deviceAuthMiddleware);

router.post("/scan", deviceScanRateLimit, deviceScanController);
router.post("/authentication", deviceScanRateLimit, deviceAuthenticationController);
router.post("/confirm", deviceConfirmRateLimit, deviceConfirmController);

export default router;
