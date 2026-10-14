import express from 'express';
import { getSparesList, updateSpareRequisition } from '../data/store.js';

const router = express.Router();

// GET all spares in inventory
router.get('/', async (req, res) => {
  try {
    const spares = await getSparesList();
    res.json({ success: true, count: spares.length, data: spares });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH requisition status
router.patch('/:partNumber/requisition', async (req, res) => {
  try {
    const updated = await updateSpareRequisition(req.params.partNumber, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Spare part not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
