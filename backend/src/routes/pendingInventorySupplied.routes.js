import express from "express";
import {
  getAllPendingInventorySupplied,
  getPendingInventorySuppliedById,
  updatePendingInventorySupplied,
  confirmPendingInventorySupplied,
  deletePendingInventorySupplied
} from '../controllers/pendingInventorySupplied.controller.js';

const router = express.Router();

router.route("/confirm/:id").post(confirmPendingInventorySupplied);
router.route("/get-all").get(getAllPendingInventorySupplied);
router.route("/get/:id").get(getPendingInventorySuppliedById);
router.route("/update/:id").put(updatePendingInventorySupplied);
router.route("/delete/:id").delete(deletePendingInventorySupplied);

export default router;
