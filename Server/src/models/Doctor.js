import mongoose, { Schema } from 'mongoose';

const DoctorSchema = new Schema({
  name: { type: String, required: true, index: true },
  specializations: { type: [String], index: true },
  modes: { type: [String], enum: ['online', 'in-person'] },
  profile: { type: String },
  location: {
    city: String,
    address: String,
    lat: Number,
    lng: Number
  },
  rating: { type: Number, default: 0 },
  calendarSettings: {
    timezone: { type: String, default: 'Asia/Kolkata' },
    slotDuration: { type: Number, default: 30 } 
  },
  nextAvailableAt: { type: Date, index: true }
}, { timestamps: true });

export const Doctor = mongoose.model('Doctor', DoctorSchema);