import mongoose from 'mongoose';

const spareSchema = new mongoose.Schema({
  partNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  subsystem: { type: String, required: true },
  compatibleAircraft: [{ type: String }],
  criticality: { type: String, required: true },
  depotStock: {
    centralDepotPune: { type: Number, default: 0 },
    ambalaStore: { type: Number, default: 0 },
    bareillyStore: { type: Number, default: 0 },
    sulurStore: { type: Number, default: 0 },
    puneStore: { type: Number, default: 0 },
    bidarStore: { type: Number, default: 0 }
  },
  totalAvailable: { type: Number, required: true },
  minThreshold: { type: Number, required: true },
  leadTimeDays: { type: Number, required: true },
  unitCostINR: { type: Number, required: true },
  requisitionStatus: { type: String, default: 'In Stock' },
  supplier: { type: String, default: 'OEM Logistics' }
}, { timestamps: true });

export default mongoose.models.Spare || mongoose.model('Spare', spareSchema);
