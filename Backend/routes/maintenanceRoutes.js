import express from 'express';
import { getWorkOrdersList, createWorkOrder, startWorkOrder, completeWorkOrder, validateWorkOrder } from '../data/store.js';

const router = express.Router();

// GET all work orders (supports ?assignedTechnician=Rahul%20Sharma)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.assignedTechnician) filter.assignedTechnician = req.query.assignedTechnician;
    if (req.query.aircraftId) filter.aircraftId = req.query.aircraftId;

    const orders = await getWorkOrdersList(filter);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST assign new job / work order
router.post('/', async (req, res) => {
  try {
    const order = await createWorkOrder(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH start inspection (moves to 'In Progress')
router.patch('/:orderId/start', async (req, res) => {
  try {
    const order = await startWorkOrder(req.params.orderId, req.body || {});
    if (!order) {
      return res.status(404).json({ success: false, message: 'Work order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST complete inspection & work order (submitted by technician)
router.post('/:orderId/complete', async (req, res) => {
  try {
    const order = await completeWorkOrder(req.params.orderId, req.body);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Work order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST validate and issue passing order (by fleet admin)
router.post('/:orderId/validate', async (req, res) => {
  try {
    const order = await validateWorkOrder(req.params.orderId, req.body);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Work order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
