import { getAllMaterialSupplied, deleteMaterialSupplied } from "../controllers/materialSupplied.controller.js";
import { Router } from 'express';

const router = Router();

router.route('/get-all').get(getAllMaterialSupplied);
router.route('/delete/:id').delete(deleteMaterialSupplied);

export default router;
