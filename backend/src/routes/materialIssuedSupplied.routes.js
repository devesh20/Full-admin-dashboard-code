import { getAllMaterialIssuedSupplied, deleteMaterialIssuedSupplied } from "../controllers/materialIssuedSupplied.controller.js";
import { Router } from "express";

const router = Router();

router.route("/get-all").get(getAllMaterialIssuedSupplied);
router.route("/delete/:id").delete(deleteMaterialIssuedSupplied);

export default router;
