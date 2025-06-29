import express from "express";
import { getConsumablesInventoryData, updateConsumablesInventoryLimit } from "../controllers/consumableInventory.controller.js";

const router = express.Router();

router.get("/get-all", getConsumablesInventoryData);
router.put("/update-limit", updateConsumablesInventoryLimit);

export default router;
