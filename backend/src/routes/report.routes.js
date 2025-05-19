import { generateCastingReport, getOrderProductionGraph,getMaterialReceivedReport } from '../controllers/report.controller.js';
import { Router } from 'express';

const router = Router();

router.route('/diecasting').post(generateCastingReport);

// New route for graph generation by PO number
router.route('/production/order/:poNumber').get(getOrderProductionGraph);

router.route('/materialReceived').post(getMaterialReceivedReport);  

export default router;
