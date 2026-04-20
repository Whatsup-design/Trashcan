import express from 'express';
import { UserDashboardController } from '../controller/user/dashboard.js';
import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";



const router = express.Router();

router.use(authMiddleware, requireRole("student"));
router.get('/Dashboard', UserDashboardController);

// router.get('/Market', MarketController);

// router.get('/Ledaerboard', LeaderboardController);

export default router;

