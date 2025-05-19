    import express from "express";
import { getSuppliedInventoryData } from "../controllers/suppliedInventory.controller.js";

const router = express.Router();

// GET all supplied inventory
router.get("/get-all", getSuppliedInventoryData);

export default router;
