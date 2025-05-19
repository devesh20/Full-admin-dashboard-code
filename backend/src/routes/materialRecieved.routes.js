import { getAllMaterialRecieved,deleteMaterialRecieved } from "../controllers/materialRecieved.controller.js";
import {Router} from 'express'

const router = Router()

router.route('/get-all').get(getAllMaterialRecieved)
router.route('/delete/:id').delete(deleteMaterialRecieved)

export default router