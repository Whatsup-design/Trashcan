import express from "express";

import { loginController } from "../controller/auth/login.js";
import { loginRateLimit } from "../middleware/rateLimit/limits.js";

const router = express.Router();

router.post("/login", loginRateLimit, loginController);

export default router;
