import express from "express";
import {
  deviceConfirmController,
  deviceScanController,
} from "../controller/admin/devices.js";

const router = express.Router();

router.post("/scan", deviceScanController);
router.post("/confirm", deviceConfirmController);

export default router;
