import express from "express";
import { line, lineConfig } from "../lib/line.js";
import { lineWebhookController } from "../controller/line/webhook.js";

const router = express.Router();

router.post("/", line.middleware(lineConfig), lineWebhookController);

export default router;
