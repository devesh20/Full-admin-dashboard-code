import express from "express";
import { getConsumablesInventoryData } from "../controllers/consumableInventory.controller.js";

const router = express.Router();

router.get("/get-all", getConsumablesInventoryData);

export default router;
