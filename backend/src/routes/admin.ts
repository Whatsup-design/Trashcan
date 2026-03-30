import express from 'express';
import { dashboardController } from '../controller/admin/dashboard.js';
import { dataController } from '../controller/admin/data.js';


const router = express.Router();

router.get('/Dashboard', dashboardController);

router.get('/Data', dataController);


export default router;


