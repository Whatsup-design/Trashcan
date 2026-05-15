import express from "express";
import { sendApprovalCardController } from "../controller/line/sendApprovalCard.controller.js";

const router = express.Router();

router.post("/test-approval-card", sendApprovalCardController);

export default router;
