import { getAllMaterialIssued,deleteMaterialIssued } from "../controllers/materialIssued.controller.js";
import {Router} from 'express'

const router = Router()

router.route('/get-all').get(getAllMaterialIssued)
router.route('/delete/:id').delete(deleteMaterialIssued)

export default router