import express from 'express';
import { UserDashboardController } from '../controller/user/dashboard.js';



const router = express.Router();

router.get('/Dashboard', UserDashboardController);

// router.get('/Market', MarketController);

// router.get('/Ledaerboard', LeaderboardController);

export default router;

