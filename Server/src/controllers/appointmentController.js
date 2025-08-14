import { v4 as uuidv4 } from 'uuid';
import { Appointment } from '../models/Appointment.js';
import { ok, created } from '../utils/responses.js';
import { assert } from '../utils/validator.js';
import { redis } from '../config/redis.js';
import { env } from '../config/env.js';

function lockKey(doctorId, slotStartISO) {
  return `lock:${doctorId}:${slotStartISO}`;
}

export const lockSlot = async (req, res) => {
  const { doctorId, slotStart, slotEnd } = req.body;
  assert(doctorId && slotStart && slotEnd, 'doctorId, slotStart, slotEnd required');
  const lockId = uuidv4();
  const slotStartISO = new Date(slotStart).toISOString();
  const key = lockKey(doctorId, slotStartISO);
  const value = JSON.stringify({ lockId, userId: req.user?.id || null, slotStart: slotStartISO, slotEnd, doctorId });
  const result = await redis.set(key, value, 'NX', 'EX', env.LOCK_TTL_SECONDS);
  assert(result === 'OK', 'Slot already locked', 409);
  return created(res, { lockId, expiresIn: env.LOCK_TTL_SECONDS });
};

export const confirmSlot = async (req, res) => {
  const { lockId, doctorId, slotStart, slotEnd, mockOtp } = req.body;
  assert(lockId && doctorId && slotStart && slotEnd, 'Missing fields');
  assert(mockOtp === '1234', 'Invalid OTP', 400);

  const slotStartISO = new Date(slotStart).toISOString();
  const key = lockKey(doctorId, slotStartISO);
  const value = await redis.get(key);
  assert(value, 'Lock not found or expired', 410);
  const obj = JSON.parse(value);
  assert(obj.lockId === lockId, 'Lock mismatch', 409);

  try {
    const appt = await Appointment.create({
      userId: req.user.id,
      doctorId,
      startAt: slotStartISO,
      endAt: new Date(slotEnd).toISOString(),
      status: 'CONFIRMED',
      lockId
    });
    await redis.del(key);
    return created(res, { appointment: appt });
  } catch (e) {
    // Handle unique index violation (double-booking attempt)
    if (e?.code === 11000) {
      return res.status(409).json({ message: 'Slot already booked' });
    }
    throw e;
  }
};

export const cancelAppointment = async (req, res) => {
  const { id } = req.params;
  const appt = await Appointment.findById(id);
  assert(appt, 'Appointment not found', 404);
  assert(String(appt.userId) === req.user.id || req.user.roles.includes('admin'), 'Forbidden', 403);
  const diffHrs = (new Date(appt.startAt) - new Date()) / (1000 * 60 * 60);
  assert(diffHrs > env.CANCEL_WINDOW_HOURS, `Cancellations allowed >${env.CANCEL_WINDOW_HOURS}h before start`);
  appt.status = 'CANCELLED';
  await appt.save();
  return ok(res, { appointment: appt });
};

export const rescheduleAppointment = async (req, res) => {
  const { id } = req.params;
  const { doctorId, newStart, newEnd } = req.body;
  assert(doctorId && newStart && newEnd, 'Missing fields');
  const appt = await Appointment.findById(id);
  assert(appt, 'Appointment not found', 404);
  assert(String(appt.userId) === req.user.id || req.user.roles.includes('admin'), 'Forbidden', 403);
  const diffHrs = (new Date(appt.startAt) - new Date()) / (1000 * 60 * 60);
  assert(diffHrs > env.CANCEL_WINDOW_HOURS, `Reschedule allowed >${env.CANCEL_WINDOW_HOURS}h before start`);

  // Try to book the new slot (no lock path here; you can require lock+confirm flow as well)
  try {
    appt.doctorId = doctorId;
    appt.startAt = new Date(newStart).toISOString();
    appt.endAt = new Date(newEnd).toISOString();
    appt.status = 'RESCHEDULED';
    await appt.save();
    // Create a new confirmed appointment for the new slot (pattern: keep history & new appt)
    const newAppt = await Appointment.create({
      userId: req.user.id,
      doctorId,
      startAt: appt.startAt,
      endAt: appt.endAt,
      status: 'CONFIRMED'
    });
    return ok(res, { previous: appt, appointment: newAppt });
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ message: 'New slot already booked' });
    throw e;
  }
};

export const listAppointments = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const q = { userId: req.user.id };
  if (status) q.status = status;
  const items = await Appointment.find(q).sort({ startAt: 1 }).limit(Number(limit)).skip((Number(page) - 1) * Number(limit));
  return ok(res, { items });
};

export const getAppointment = async (req, res) => {
  const { id } = req.params;
  const item = await Appointment.findById(id);
  assert(item && String(item.userId) === req.user.id, 'Not found', 404);
  return ok(res, { item });
};