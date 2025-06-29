import { getInventoryData, updateInventoryLimit } from "../controllers/inventory.controller.js";
import {Router} from 'express'

const router = Router()

router.route('/get-all').get(getInventoryData)
router.route('/update-limit').put(updateInventoryLimit)

export default router