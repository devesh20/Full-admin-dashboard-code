import express from "express";
import {
  getAllPendingInventory,
  getPendingInventoryById,
  updatePendingInventory,
  confirmPendingInventory,
  deletePendingInventory
} from '../controllers/pendingInventory.controller.js'

const router = express.Router();

router.route("/confirm/:id").post(confirmPendingInventory);
router.route("/get-all").get(getAllPendingInventory);
router.route("/get/:id").get(getPendingInventoryById);
router.route("/update/:id").put(updatePendingInventory);
router.route("/delete/:id").delete(deletePendingInventory);


export default router;
