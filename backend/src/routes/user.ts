import express from 'express';
import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

import { UserDashboardController } from '../controller/user/dashboard.js';
import { UserLeaderboardController } from '../controller/user/Leaderboard.js';
import { UserBannerController } from '../controller/user/banner.js';
import { UserMarketController } from '../controller/user/market.js';



const router = express.Router();

router.use(authMiddleware, requireRole("student"));
router.get('/Dashboard', UserDashboardController);

router.get('/Leaderboard', UserLeaderboardController);

router.get('/Banner', UserBannerController);

router.get('/Market', UserMarketController);




// router.get('/Ledaerboard', LeaderboardController);

export default router;

