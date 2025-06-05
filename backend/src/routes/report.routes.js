import { generateCastingReport, getOrderProductionGraph,getMaterialReceivedReport,getRotorOrderProductionGraph } from '../controllers/report.controller.js';
import { Router } from 'express';

const router = Router();

router.route('/diecasting').post(generateCastingReport);

// New route for graph generation by PO number
router.route('/production/order/:poNumber').get(getOrderProductionGraph);

router.route('/production/rotor-order/:annexureNumber').get(getRotorOrderProductionGraph);


router.route('/materialReceived').post(getMaterialReceivedReport);  

export default router;
