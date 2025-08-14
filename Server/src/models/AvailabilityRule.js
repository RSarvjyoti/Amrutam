import mongoose, { Schema } from 'mongoose';

const AvailabilityRuleSchema = new Schema({
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', index: true, required: true },
  type: { type: String, enum: ['one-off', 'recurring'], required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  daysOfWeek: { type: [Number] },
  startTime: { type: String, required: true }, 
  endTime: { type: String, required: true },  
  slotDurationMinutes: { type: Number, default: 30 },
  maxPerSlot: { type: Number, default: 1 }
}, { timestamps: true });

export const AvailabilityRule = mongoose.model('AvailabilityRule', AvailabilityRuleSchema);