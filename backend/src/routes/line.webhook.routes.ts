import express from "express";
import { line, lineConfig } from "../lib/line.js";
import { lineWebhookController } from "../controller/line/lineWebhook.controller.js";
import { lineAllRedeemRateLimit } from "../middleware/rateLimit/limits.js";

const router = express.Router();

router.post("/", line.middleware(lineConfig), lineAllRedeemRateLimit, lineWebhookController);

export default router;
