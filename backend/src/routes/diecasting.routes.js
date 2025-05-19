import express from "express";
import { getAllDiecastings, deleteDiecasting, updateDiecasting, getDiecastingById } from "../controllers/diecasting.controller.js";

const router = express.Router();

router.get("/get-all", getAllDiecastings);
router.delete("/delete/:id", deleteDiecasting);
router.put("/update/:id", updateDiecasting);
router.get("/:id", getDiecastingById);

export default router;
