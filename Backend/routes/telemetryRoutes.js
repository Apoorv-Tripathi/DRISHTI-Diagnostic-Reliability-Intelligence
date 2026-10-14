import express from 'express';
import { generateTelemetryHistory } from '../data/store.js';

const router = express.Router();

// GET historical & predicted telemetry curve for an aircraft
router.get('/:aircraftId', (req, res) => {
  try {
    const data = generateTelemetryHistory(req.params.aircraftId);
    res.json({ success: true, aircraftId: req.params.aircraftId, ...data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
