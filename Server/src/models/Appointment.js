import mongoose, { Schema } from 'mongoose';

const AppointmentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
  startAt: { type: Date, required: true, index: true },
  endAt: { type: Date, required: true },
  status: { type: String, enum: ['BOOKED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'], default: 'CONFIRMED', index: true },
  lockId: { type: String },
  notes: { type: String }
}, { timestamps: true });

AppointmentSchema.index(
  { doctorId: 1, startAt: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['BOOKED', 'CONFIRMED'] } } }
);

export const Appointment = mongoose.model('Appointment', AppointmentSchema);