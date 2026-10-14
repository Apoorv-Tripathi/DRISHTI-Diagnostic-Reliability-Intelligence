import express from 'express';
import { fleetAnalyticsSummary, getAircraftList } from '../data/store.js';

const router = express.Router();

// GET fleet analytics KPI summary
router.get('/', async (req, res) => {
  try {
    const aircraft = await getAircraftList();
    const total = aircraft.length;
    const missionCapable = aircraft.filter(a => a.status === 'Mission Capable').length;
    const partial = aircraft.filter(a => a.status === 'Partially Mission Capable').length;
    const inspection = aircraft.filter(a => a.status === 'Under Inspection').length;
    const spares = aircraft.filter(a => a.status === 'Awaiting Spares').length;
    const availabilityRate = total > 0 ? +(((missionCapable + partial) / total) * 100).toFixed(1) : 0;

    const dynamicSummary = {
      ...fleetAnalyticsSummary,
      totalAircraft: total,
      missionCapableCount: missionCapable,
      partiallyMissionCapableCount: partial,
      underInspectionCount: inspection,
      awaitingSparesCount: spares,
      fleetAvailabilityRate: availabilityRate
    };

    res.json({ success: true, data: dynamicSummary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
