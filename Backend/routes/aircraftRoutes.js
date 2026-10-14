import express from 'express';
import { getAircraftList, getAircraftById, updateAircraftStatus } from '../data/store.js';

const router = express.Router();

// GET all aircraft in fleet
router.get('/', async (req, res) => {
  try {
    const list = await getAircraftList();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET aircraft by ID
router.get('/:id', async (req, res) => {
  try {
    const aircraft = await getAircraftById(req.params.id);
    if (!aircraft) {
      return res.status(404).json({ success: false, message: 'Aircraft not found' });
    }
    res.json({ success: true, data: aircraft });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH update status
router.patch('/:id/status', async (req, res) => {
  try {
    const updated = await updateAircraftStatus(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Aircraft not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
