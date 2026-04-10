  import express from 'express';
  import { dashboardController } from '../controller/admin/dashboard.js';
  import { dataController } from '../controller/admin/data.js';
  import {activityLogController} from "../controller/admin/activityLog.js";
  import {overviewController} from "../controller/admin/overview.js";


  import {
    getAllProductsController,
    getProductByIdController,
    createProductController,
    updateProductController,
    deleteProductController,
  } from "../controller/admin/market.js";

  import {
    deviceScanController,
    deviceConfirmController,
  } from "../controller/admin/devices.js";


  const router = express.Router();
  // ── ข้อมูลสำหรับหน้า Dashboard ───────────────────────────────
  router.get('/Dashboard', dashboardController);

  // ── ข้อมูลสำหรับหน้า Data  ───────────────────────────────
  router.get('/Data', dataController);

  // ── ข้อมูลสำหรับหน้า Activity Log ───────────────────────────────
  router.get("/ActivityLog", activityLogController);

  // ── ข้อมูลสำหรับหน้า Market ───────────────────────────────
  router.get("/Market", getAllProductsController);
  router.get("/Market/:id", getProductByIdController);
  router.post("/Market", createProductController);
  router.put("/Market/:id", updateProductController);
  router.delete("/Market/:id", deleteProductController);

  //-─ ข้อมูลสำหรับหน้า Overview ───────────────────────────────
  router.get('/overview', overviewController);

  // ── ข้อมูลสำหรับหน้า Devices ───────────────────────────────
  router.post("/devices/scan", deviceScanController);
  router.post("/devices/confirm", deviceConfirmController);



  export default router;


