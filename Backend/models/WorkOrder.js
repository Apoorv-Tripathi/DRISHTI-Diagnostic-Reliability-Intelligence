import mongoose from 'mongoose';

const workOrderSpareSchema = new mongoose.Schema({
  partNumber: String,
  partName: String,
  quantity: Number,
  status: String
}, { _id: false });

const workOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  aircraftId: { type: String, required: true },
  aircraftType: { type: String, default: 'Combat Aircraft' },
  alertId: { type: String, default: null },
  title: { type: String, required: true },
  jobType: { type: String, default: 'General Inspection' },
  subsystem: { type: String, default: 'Engine Powerplant' },
  componentName: { type: String, default: 'Turbofan Component' },
  priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low', 'Routine'], default: 'Medium' },
  status: { 
    type: String, 
    enum: ['Assigned', 'In Progress', 'Scheduled', 'Pending Spares', 'Pending Command Validation', 'Completed', 'Maintenance Directive Issued'], 
    default: 'Assigned' 
  },
  assignedTechnician: { type: String, required: true },
  assignedTechnicianId: { type: String, default: 'tech-1' },
  assignedBy: { type: String, default: 'Arjun Mehta (Fleet Administrator)' },
  assignedDate: { type: Date, default: Date.now },
  reason: { type: String, default: '' },
  predictedRul: { type: String, default: '~40 flight hours' },
  station: { type: String, default: 'Base Maintenance Hangar' },
  scheduledDate: { type: Date, default: Date.now },
  completedDate: { type: Date, default: null },
  downtimeSavedEstimateHours: { type: Number, default: 0 },
  sparesRequired: [workOrderSpareSchema],
  sensorReadings: {
    vibration: { type: String, default: '' },
    temperature: { type: String, default: '' },
    pressure: { type: String, default: '' },
    rpm: { type: String, default: '' },
    egt: { type: String, default: '' },
    chipDetector: { type: String, default: '' }
  },
  findings: { type: String, default: '' },
  actionTaken: { type: String, default: '' },
  technicianNotes: { type: String, default: '' },
  aiRecommendation: { type: String, default: '' },
  technicianRecommendation: { type: String, default: '' },
  adminAction: { type: String, default: '' },
  adminPassingDirective: { type: String, default: '' },
  adminReviewedBy: { type: String, default: '' },
  adminReviewedAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.models.WorkOrder || mongoose.model('WorkOrder', workOrderSchema);
