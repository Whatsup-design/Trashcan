import express from 'express';
import { dashboardController } from '../controller/admin/dashboard.js';


const router = express.Router();

router.get('/Dashboard', dashboardController);


export default router;
