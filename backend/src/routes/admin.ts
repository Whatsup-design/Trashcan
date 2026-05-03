import express from "express";
import multer from "multer";
import { dashboardController } from "../controller/admin/dashboard.js";
import { dataController } from "../controller/admin/data.js";
import { activityLogController } from "../controller/admin/activityLog.js";
import { overviewController } from "../controller/admin/overview.js";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
} from "../controller/admin/market.js";
import {
  deviceConfirmController,
  deviceScanController,
} from "../controller/admin/devices.js";
import authMiddleware from "../middleware/authMiddleware.js";
import deviceAuthMiddleware from "../middleware/device/deviceAuthMiddleware.js";
import {
  deviceConfirmRateLimit,
  deviceScanRateLimit,
} from "../middleware/rateLimit/limits.js";
import requireRole from "../middleware/roleMiddleware.js";
import { supabase } from "../lib/supabase.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public device routes for ESP/hardware flow.
router.post("/devices/scan", deviceAuthMiddleware, deviceScanRateLimit, deviceScanController);
router.post("/devices/confirm", deviceAuthMiddleware, deviceConfirmRateLimit, deviceConfirmController);

// Admin-protected routes.
router.use(authMiddleware, requireRole("admin"));

router.get("/Dashboard", dashboardController);
router.get("/Data", dataController);
router.get("/ActivityLog", activityLogController);

router.get("/Market", getAllProductsController);
router.get("/Market/:id", getProductByIdController);
router.post("/Market", upload.single("Product_Img"), createProductController);
router.put("/Market/:id", upload.single("Product_Img"), updateProductController);
router.delete("/Market/:id", deleteProductController);

router.get("/overview", overviewController);

router.get("/school/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("School_Data")
      .select("*")
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
