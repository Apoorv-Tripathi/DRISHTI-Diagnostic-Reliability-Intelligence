import mongoose from 'mongoose';

const requiredSparePartSchema = new mongoose.Schema({
  partNumber: String,
  name: String,
  quantity: Number,
  availability: String
}, { _id: false });

const alertSchema = new mongoose.Schema({
  alertId: { type: String, required: true, unique: true },
  aircraftId: { type: String, required: true },
  subsystem: { type: String, required: true },
  componentId: { type: String, required: true },
  componentName: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  timestamp: { type: Date, default: Date.now },
  anomalyDescription: { type: String, required: true },
  detectionAlgorithm: { type: String, default: 'Isolation Forest Multivariate Model' },
  confidence: { type: Number, default: 90.0 },
  rulEstimateHours: { type: Number, required: true },
  rulConfidenceInterval: {
    min: Number,
    max: Number
  },
  actionRecommendation: { type: String, required: true },
  requiredSpareParts: [requiredSparePartSchema],
  status: { type: String, enum: ['Active', 'Investigating', 'Work Order Created', 'Resolved'], default: 'Active' },
  workOrderId: { type: String, default: null }
}, { timestamps: true });

export default mongoose.models.Alert || mongoose.model('Alert', alertSchema);
