import { Router } from "express";
import {
  createRotorOrder,
  getAllRotorOrders,
  refreshRotorOrderStatus
} from "../controllers/rotorOrder.controller.js";

const router = Router();

router.route('/create').post(createRotorOrder);
router.route('/get-all').get(getAllRotorOrders);
router.route('/refresh-status').post(refreshRotorOrderStatus);

export default router;
