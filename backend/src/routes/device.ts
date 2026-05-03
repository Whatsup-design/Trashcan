import express from "express";
import {
  deviceConfirmController,
  deviceScanController,
} from "../controller/admin/devices.js";
import deviceAuthMiddleware from "../middleware/device/deviceAuthMiddleware.js";
import {
  deviceConfirmRateLimit,
  deviceScanRateLimit,
} from "../middleware/rateLimit/limits.js";

const router = express.Router();

router.use(deviceAuthMiddleware);

router.post("/scan", deviceScanRateLimit, deviceScanController);
router.post("/confirm", deviceConfirmRateLimit, deviceConfirmController);

export default router;
