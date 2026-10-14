import mongoose from 'mongoose';
import Aircraft from '../models/Aircraft.js';
import Alert from '../models/Alert.js';
import Spare from '../models/Spare.js';
import WorkOrder from '../models/WorkOrder.js';
import { initialAircraft, initialAlerts, initialSpares, initialWorkOrders, generateTelemetryHistory, fleetAnalyticsSummary, demoUsers } from './initialData.js';

// Local memory cache
let inMemoryStore = {
  aircraft: JSON.parse(JSON.stringify(initialAircraft)),
  alerts: JSON.parse(JSON.stringify(initialAlerts)),
  spares: JSON.parse(JSON.stringify(initialSpares)),
  workOrders: JSON.parse(JSON.stringify(initialWorkOrders)),
  users: JSON.parse(JSON.stringify(demoUsers))
};

export const isMongoConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

// Seed MongoDB if connected and empty
export const seedDatabaseIfConnected = async () => {
  if (!isMongoConnected()) return;
  try {
    const aircraftCount = await Aircraft.countDocuments();
    if (aircraftCount === 0) {
      console.log('Seeding MongoDB with initial aerospace data...');
      await Aircraft.insertMany(initialAircraft);
      await Alert.insertMany(initialAlerts);
      await Spare.insertMany(initialSpares);
      await WorkOrder.insertMany(initialWorkOrders);
      console.log('MongoDB successfully seeded.');
    }
  } catch (err) {
    console.warn('Seeding check failed, continuing with live store:', err.message);
  }
};

// User queries
export const getUsersList = () => inMemoryStore.users;

// Aircraft queries
export const getAircraftList = async () => {
  if (isMongoConnected()) {
    try {
      return await Aircraft.find().sort({ overallHealth: 1 });
    } catch (e) {
      console.warn('Mongo query failed, falling back to in-memory store');
    }
  }
  return inMemoryStore.aircraft;
};

export const getAircraftById = async (id) => {
  if (isMongoConnected()) {
    try {
      const doc = await Aircraft.findOne({ aircraftId: id });
      if (doc) return doc;
    } catch (e) {
      console.warn('Mongo query failed, falling back');
    }
  }
  return inMemoryStore.aircraft.find(a => a.aircraftId === id) || null;
};

export const updateAircraftStatus = async (id, updateData) => {
  if (isMongoConnected()) {
    try {
      const updated = await Aircraft.findOneAndUpdate({ aircraftId: id }, updateData, { new: true });
      if (updated) return updated;
    } catch (e) {
      console.warn('Mongo update failed, falling back');
    }
  }
  const idx = inMemoryStore.aircraft.findIndex(a => a.aircraftId === id);
  if (idx !== -1) {
    inMemoryStore.aircraft[idx] = { ...inMemoryStore.aircraft[idx], ...updateData };
    return inMemoryStore.aircraft[idx];
  }
  return null;
};

// Alert queries
export const getAlertsList = async (filter = {}) => {
  if (isMongoConnected()) {
    try {
      return await Alert.find(filter).sort({ timestamp: -1 });
    } catch (e) {
      console.warn('Mongo alert query failed, falling back');
    }
  }
  let list = inMemoryStore.alerts;
  if (filter.aircraftId) {
    list = list.filter(a => a.aircraftId === filter.aircraftId);
  }
  if (filter.status) {
    list = list.filter(a => a.status === filter.status);
  }
  return list;
};

export const getAlertById = async (id) => {
  if (isMongoConnected()) {
    try {
      const alert = await Alert.findOne({ alertId: id });
      if (alert) return alert;
    } catch (e) {
      console.warn('Mongo alert query failed, falling back');
    }
  }
  return inMemoryStore.alerts.find(a => a.alertId === id) || null;
};

export const updateAlertStatus = async (alertId, status, workOrderId = null) => {
  const update = { status };
  if (workOrderId) update.workOrderId = workOrderId;

  if (isMongoConnected()) {
    try {
      return await Alert.findOneAndUpdate({ alertId }, update, { new: true });
    } catch (e) {
      console.warn('Mongo update alert failed, falling back');
    }
  }
  const idx = inMemoryStore.alerts.findIndex(a => a.alertId === alertId);
  if (idx !== -1) {
    inMemoryStore.alerts[idx] = { ...inMemoryStore.alerts[idx], ...update };
    return inMemoryStore.alerts[idx];
  }
  return null;
};

// Spares queries
export const getSparesList = async () => {
  if (isMongoConnected()) {
    try {
      return await Spare.find().sort({ criticality: 1 });
    } catch (e) {
      console.warn('Mongo spares query failed, falling back');
    }
  }
  return inMemoryStore.spares;
};

export const updateSpareRequisition = async (partNumber, updateData) => {
  if (isMongoConnected()) {
    try {
      return await Spare.findOneAndUpdate({ partNumber }, updateData, { new: true });
    } catch (e) {
      console.warn('Mongo spare update failed, falling back');
    }
  }
  const idx = inMemoryStore.spares.findIndex(s => s.partNumber === partNumber);
  if (idx !== -1) {
    inMemoryStore.spares[idx] = { ...inMemoryStore.spares[idx], ...updateData };
    return inMemoryStore.spares[idx];
  }
  return null;
};

// Work orders / Jobs queries
export const getWorkOrdersList = async (filter = {}) => {
  if (isMongoConnected()) {
    try {
      return await WorkOrder.find(filter).sort({ scheduledDate: -1 });
    } catch (e) {
      console.warn('Mongo work order query failed, falling back');
    }
  }
  let orders = inMemoryStore.workOrders;
  if (filter.assignedTechnician) {
    orders = orders.filter(w => w.assignedTechnician.toLowerCase().includes(filter.assignedTechnician.toLowerCase()));
  }
  if (filter.aircraftId) {
    orders = orders.filter(w => w.aircraftId === filter.aircraftId);
  }
  return orders;
};

export const createWorkOrder = async (orderData) => {
  const newId = `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const order = {
    orderId: newId,
    scheduledDate: new Date(),
    assignedDate: new Date(),
    status: orderData.status || 'Assigned',
    ...orderData
  };

  if (isMongoConnected()) {
    try {
      const created = await WorkOrder.create(order);
      if (order.alertId) {
        await Alert.findOneAndUpdate({ alertId: order.alertId }, { status: 'Work Order Created', workOrderId: newId });
      }
      return created;
    } catch (e) {
      console.warn('Mongo create order failed, falling back:', e.message);
    }
  }

  inMemoryStore.workOrders.unshift(order);
  if (order.alertId) {
    const alertIdx = inMemoryStore.alerts.findIndex(a => a.alertId === order.alertId);
    if (alertIdx !== -1) {
      inMemoryStore.alerts[alertIdx].status = 'Work Order Created';
      inMemoryStore.alerts[alertIdx].workOrderId = newId;
    }
  }
  return order;
};

export const startWorkOrder = async (orderId, fallbackData = {}) => {
  const update = { status: 'In Progress' };
  if (isMongoConnected()) {
    try {
      let doc = await WorkOrder.findOneAndUpdate({ orderId }, update, { new: true });
      if (doc) return doc;
      
      // If orderId is an ad-hoc or virtual diagnostic order (e.g. WO-DIAG-AF-04), create or find by aircraft
      const created = await WorkOrder.create({
        orderId: orderId,
        aircraftId: fallbackData.aircraftId || (orderId.includes('AF-') ? orderId.split('-').slice(-2).join('-') : 'AF-04'),
        title: fallbackData.title || `Avionics Diagnostic Inspection (${orderId})`,
        jobType: fallbackData.jobType || 'GSE Diagnostic Inspection',
        subsystem: fallbackData.subsystem || 'Turbofan Powerplant',
        priority: fallbackData.priority || 'High',
        status: 'In Progress',
        assignedTechnician: fallbackData.assignedTechnician || 'Rahul Sharma',
        assignedBy: 'Air Command Automated Diagnostic GSE',
        reason: fallbackData.reason || 'Telemetry extraction anomaly requiring physical inspection',
        predictedRul: fallbackData.predictedRul || '~38 flight hours',
        station: 'Ambala AFS - Bay 3',
        scheduledDate: new Date(),
        assignedDate: new Date()
      });
      return created;
    } catch (e) {
      console.warn('Mongo start order failed, falling back:', e.message);
    }
  }
  const idx = inMemoryStore.workOrders.findIndex(w => w.orderId === orderId);
  if (idx !== -1) {
    inMemoryStore.workOrders[idx].status = 'In Progress';
    return inMemoryStore.workOrders[idx];
  }
  
  // In-memory fallback create
  const fallbackOrder = {
    orderId,
    aircraftId: fallbackData.aircraftId || 'AF-04',
    title: fallbackData.title || `Avionics Diagnostic Inspection (${orderId})`,
    jobType: 'GSE Diagnostic Inspection',
    status: 'In Progress',
    assignedTechnician: fallbackData.assignedTechnician || 'Rahul Sharma',
    scheduledDate: new Date(),
    assignedDate: new Date()
  };
  inMemoryStore.workOrders.unshift(fallbackOrder);
  return fallbackOrder;
};

export const completeWorkOrder = async (orderId, outcomeData = {}) => {
  const update = {
    status: outcomeData.status || 'Pending Command Validation',
    completedDate: new Date(),
    findings: outcomeData.findings || 'Inspection & replacement confirmed to specs.',
    actionTaken: outcomeData.actionTaken || 'Part inspected and recalibrated.',
    technicianNotes: outcomeData.technicianNotes || 'Aircraft certified and cleared for sortie release.',
    aiRecommendation: outcomeData.aiRecommendation || '',
    technicianRecommendation: outcomeData.technicianRecommendation || '',
    busResults: outcomeData.busResults || null
  };

  let targetOrder = null;
  if (isMongoConnected()) {
    try {
      targetOrder = await WorkOrder.findOneAndUpdate({ orderId }, update, { new: true });
    } catch (e) {
      console.warn('Mongo complete order failed, falling back');
    }
  }

  if (!targetOrder) {
    const idx = inMemoryStore.workOrders.findIndex(w => w.orderId === orderId);
    if (idx !== -1) {
      inMemoryStore.workOrders[idx] = { ...inMemoryStore.workOrders[idx], ...update };
      targetOrder = inMemoryStore.workOrders[idx];
    }
  }

  // If technician submitted report awaiting Admin Command Validation, aircraft strictly remains Under Inspection
  if (targetOrder && targetOrder.aircraftId) {
    if (outcomeData.status === 'Completed') {
      await updateAircraftStatus(targetOrder.aircraftId, {
        status: 'Mission Capable',
        overallHealth: 95,
        riskLevel: 'Low',
        rulHours: 180.0,
        activeAlertCount: 0
      });

      if (targetOrder.alertId) {
        await updateAlertStatus(targetOrder.alertId, 'Resolved');
      }
    } else {
      // Awaiting admin passing order: airframe remains grounded / under inspection
      await updateAircraftStatus(targetOrder.aircraftId, {
        status: 'Under Inspection',
        overallHealth: outcomeData.technicianRecommendation === 'FLIGHT_CLEARED' ? 82 : 70,
        riskLevel: outcomeData.technicianRecommendation === 'FLIGHT_CLEARED' ? 'Medium' : 'High'
      });
    }
  }

  return targetOrder;
};

export const validateWorkOrder = async (orderId, validationData = {}) => {
  const isMaintenance = validationData.adminDecision === 'approveMaintenance';
  
  const update = {
    status: isMaintenance ? 'Maintenance Directive Issued' : 'Completed',
    adminAction: isMaintenance ? 'Approved Heavy Maintenance Transfer' : 'Cleared for Flight Sortie',
    adminPassingDirective: validationData.directiveText || (isMaintenance ? 'Command Order: Scheduled for Base Heavy Maintenance Wing.' : 'Command Order: Released to active flight sortie schedule.'),
    adminReviewedBy: validationData.reviewedBy || 'Arjun Mehta (Fleet Administrator)',
    adminReviewedAt: new Date()
  };

  let targetOrder = null;
  if (isMongoConnected()) {
    try {
      targetOrder = await WorkOrder.findOneAndUpdate({ orderId }, update, { new: true });
    } catch (e) {
      console.warn('Mongo validate order failed, falling back');
    }
  }

  if (!targetOrder) {
    const idx = inMemoryStore.workOrders.findIndex(w => w.orderId === orderId);
    if (idx !== -1) {
      inMemoryStore.workOrders[idx] = { ...inMemoryStore.workOrders[idx], ...update };
      targetOrder = inMemoryStore.workOrders[idx];
    }
  }

  if (targetOrder && targetOrder.aircraftId) {
    if (isMaintenance) {
      // Aircraft goes under maintenance
      await updateAircraftStatus(targetOrder.aircraftId, {
        status: 'Under Maintenance',
        overallHealth: 72,
        riskLevel: 'Medium',
        rulHours: 38.0,
        activeAlertCount: 1
      });
    } else {
      // Restored to Mission Capable
      await updateAircraftStatus(targetOrder.aircraftId, {
        status: 'Mission Capable',
        overallHealth: 95,
        riskLevel: 'Low',
        rulHours: 180.0,
        activeAlertCount: 0
      });
      if (targetOrder.alertId) {
        await updateAlertStatus(targetOrder.alertId, 'Resolved');
      }
    }
  }

  return targetOrder;
};

export { generateTelemetryHistory, fleetAnalyticsSummary, demoUsers };
