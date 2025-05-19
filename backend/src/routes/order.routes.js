import {Router} from "express"
import {createOrder,getAllOrders,refreshOrderStatus} from "../controllers/order.controller.js"

const router = Router()

router.route('/create').post(createOrder)
router.route('/get-all').get(getAllOrders)
router.route('/refresh-status').post(refreshOrderStatus)
export default router