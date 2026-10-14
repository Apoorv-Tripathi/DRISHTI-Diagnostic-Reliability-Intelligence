import express from 'express';
import { getAlertsList, getAlertById, updateAlertStatus } from '../data/store.js';

const router = express.Router();

// GET all alerts (supports ?aircraftId=AF-104&status=Active)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.aircraftId) filter.aircraftId = req.query.aircraftId;
    if (req.query.status) filter.status = req.query.status;

    const alerts = await getAlertsList(filter);
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET alert by ID
router.get('/:id', async (req, res) => {
  try {
    const alert = await getAlertById(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.json({ success: true, data: alert });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH alert status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, workOrderId } = req.body;
    const updated = await updateAlertStatus(req.params.id, status, workOrderId);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
