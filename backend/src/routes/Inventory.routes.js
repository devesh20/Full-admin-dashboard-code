import { getInventoryData } from "../controllers/inventory.controller.js";
import {Router} from 'express'

const router = Router()

router.route('/get-all').get(getInventoryData)

export default router