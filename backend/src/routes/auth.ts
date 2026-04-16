import express from "express";

import { loginController } from "../controller/auth/login.js";

const router = express.Router();

router.use("/login", loginController);
export default router;