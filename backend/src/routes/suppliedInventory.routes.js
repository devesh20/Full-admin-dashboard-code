import express from "express";
import { getSuppliedInventoryData, updateSuppliedInventoryLimit } from "../controllers/suppliedInventory.controller.js";

const router = express.Router();

// GET all supplied inventory
router.get("/get-all", getSuppliedInventoryData);

// UPDATE supplied inventory limit
router.put("/update-limit", updateSuppliedInventoryLimit);

export default router;
