import express from 'express';
import fs from 'fs';
import path from 'path';
import { refreshOrderStatus } from '../controllers/order.controller.js';
import { refreshRotorOrderStatus } from '../controllers/rotorOrder.controller.js';
const router = express.Router();

const filePath = path.join(path.resolve(), 'src/data/cycleTimes.json');

// GET cycle times
router.get('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read cycle times.' });
  }
});

// UPDATE cycle times and refresh order completion times
router.post('/', async (req, res) => {
  const { cycleTimes, rotorCycleTimes } = req.body;
  if (!cycleTimes || !rotorCycleTimes) {
    return res.status(400).json({ error: 'Missing data.' });
  }
  try {
    fs.writeFileSync(filePath, JSON.stringify({ cycleTimes, rotorCycleTimes }, null, 2));
    // Recalculate expected completion times for all orders
    // Call refresh functions but do not send response from them
    refreshOrderStatus(null, null, { silent: true });
    refreshRotorOrderStatus(null, null, { silent: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cycle times.' });
  }
});

export default router;