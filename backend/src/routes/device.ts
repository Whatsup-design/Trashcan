import express from "express";
import {
  deviceConfirmController,
  deviceScanController,
} from "../controller/admin/devices.js";
import deviceAuthMiddleware from "../middleware/device/deviceAuthMiddleware.js";

const router = express.Router();

router.use(deviceAuthMiddleware);

router.post("/scan", deviceScanController);
router.post("/confirm", deviceConfirmController);

export default router;
