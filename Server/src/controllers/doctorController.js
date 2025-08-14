import { Doctor } from '../models/Doctor.js';
import { AvailabilityRule } from '../models/AvailabilityRule.js';
import { ok, created } from '../utils/responses.js';
import { assert } from '../utils/validator.js';
import { computeAvailableSlots } from '../utils/slots.js';

export const createDoctor = async (req, res) => {
  const { name, specializations = [], modes = ['online'], profile, location, calendarSettings } = req.body;
  assert(name, 'Name required');
  const doc = await Doctor.create({ name, specializations, modes, profile, location, calendarSettings });
  return created(res, { doctor: doc });
};

export const listDoctors = async (req, res) => {
  const { specialization, mode, city, sort = 'soonest', limit = 20, page = 1 } = req.query;
  const q = {};
  if (specialization) q.specializations = specialization;
  if (mode) q.modes = mode;
  if (city) q['location.city'] = city;

  let cursor = Doctor.find(q);
  if (sort === 'soonest') cursor = cursor.sort({ nextAvailableAt: 1, rating: -1 });
  const docs = await cursor.limit(Number(limit)).skip((Number(page) - 1) * Number(limit));
  return ok(res, { doctors: docs });
};

export const addAvailabilityRule = async (req, res) => {
  const { id } = req.params; // doctorId
  const { type, startDate, endDate, daysOfWeek, startTime, endTime, slotDurationMinutes, maxPerSlot } = req.body;
  assert(type && startTime && endTime, 'Missing fields');
  const rule = await AvailabilityRule.create({ doctorId: id, type, startDate, endDate, daysOfWeek, startTime, endTime, slotDurationMinutes, maxPerSlot });
  return created(res, { rule });
};

export const getAvailability = async (req, res) => {
  const { id } = req.params; 
  const { from, to } = req.query;
  assert(from && to, 'from & to required (ISO)');
  const slots = await computeAvailableSlots(id, new Date(from), new Date(to));
  return ok(res, { slots });
};