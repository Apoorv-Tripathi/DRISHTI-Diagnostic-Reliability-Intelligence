import mongoose from 'mongoose';

const subsystemSchema = new mongoose.Schema({
  name: String,
  health: Number,
  status: { type: String, enum: ['Healthy', 'Warning', 'Critical'], default: 'Healthy' },
  vibrationLevel: Number,
  egtMargin: Number,
  oilPressure: Number,
  scavengeTemp: Number,
  sysAPressure: Number,
  sysBPressure: Number,
  returnTemp: Number,
  busVoltage: Number,
  rackTemp: Number,
  bitFaults: Number,
  actuatorStrain: Number,
  surfaceDeflection: Number,
  pumpPressure: Number,
  ecsPackTemp: Number,
  details: String
}, { _id: false });

const aircraftSchema = new mongoose.Schema({
  aircraftId: { type: String, required: true, unique: true },
  callsign: { type: String, required: true },
  type: { type: String, required: true },
  squadron: { type: String, required: true },
  airbase: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Mission Capable', 'Partially Mission Capable', 'Under Inspection', 'Awaiting Spares', 'Under Maintenance'], 
    default: 'Mission Capable' 
  },
  overallHealth: { type: Number, required: true, min: 0, max: 100 },
  totalFlightHours: { type: Number, required: true },
  flightCycles: { type: Number, required: true },
  lastInspectionDate: { type: Date, default: Date.now },
  nextScheduledCheck: { type: Date },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
  rulHours: { type: Number, default: 200 },
  activeAlertCount: { type: Number, default: 0 },
  subsystems: {
    engine: subsystemSchema,
    hydraulic: subsystemSchema,
    avionics: subsystemSchema,
    flightControls: subsystemSchema,
    fuelAndEcs: subsystemSchema
  }
}, { timestamps: true });

export default mongoose.models.Aircraft || mongoose.model('Aircraft', aircraftSchema);
