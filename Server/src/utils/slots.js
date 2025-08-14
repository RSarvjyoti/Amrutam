import { AvailabilityRule } from '../models/AvailabilityRule.js';
import { Appointment } from '../models/Appointment.js';
import { redis } from '../config/redis.js';

function parseTime(str) { // "HH:MM"
  const [h, m] = str.split(':').map(Number);
  return { h, m };
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function* generateSlotsForWindow(startAt, endAt, slotMinutes) {
  let cur = new Date(startAt);
  while (cur < endAt) {
    const next = addMinutes(cur, slotMinutes);
    if (next > endAt) break;
    yield { start: new Date(cur), end: new Date(next) };
    cur = next;
  }
}

export async function computeAvailableSlots(doctorId, from, to) {
  // Fetch rules for doctor
  const rules = await AvailabilityRule.find({ doctorId });

  // Build raw candidate slots
  const slots = [];
  for (const rule of rules) {
    const slotMins = rule.slotDurationMinutes || 30;
    const windowStart = new Date(from);
    const windowEnd = new Date(to);

    if (rule.type === 'one-off') {
      const rs = parseTime(rule.startTime);
      const re = parseTime(rule.endTime);
      const base = new Date(rule.startDate);
      base.setHours(0, 0, 0, 0);
      if (base >= windowStart && base <= windowEnd) {
        const s = new Date(base);
        s.setHours(rs.h, rs.m, 0, 0);
        const e = new Date(base);
        e.setHours(re.h, re.m, 0, 0);
        for (const { start, end } of generateSlotsForWindow(s, e, slotMins)) slots.push({ start, end });
      }
    } else if (rule.type === 'recurring') {
      // iterate each day in [from,to]
      const d = new Date(windowStart);
      while (d <= windowEnd) {
        const dow = d.getDay();
        if (rule.daysOfWeek.includes(dow)) {
          const rs = parseTime(rule.startTime);
          const re = parseTime(rule.endTime);
          const s = new Date(d);
          s.setHours(rs.h, rs.m, 0, 0);
          const e = new Date(d);
          e.setHours(re.h, re.m, 0, 0);
          for (const { start, end } of generateSlotsForWindow(s, e, slotMins)) slots.push({ start, end });
        }
        d.setDate(d.getDate() + 1);
      }
    }
  }

  if (!slots.length) return [];

  // Remove already booked slots
  const booked = await Appointment.find({ doctorId, startAt: { $gte: from, $lte: to }, status: { $in: ['BOOKED', 'CONFIRMED'] } })
    .select('startAt endAt').lean();
  const bookedSet = new Set(booked.map(b => new Date(b.startAt).toISOString()));

  // Remove currently locked slots (Redis)
  const lockKeys = await redis.keys(`lock:${doctorId}:*`);
  const lockedStarts = new Set();
  if (lockKeys.length) {
    const lockVals = await redis.mget(lockKeys);
    for (const v of lockVals) {
      if (!v) continue;
      try { const obj = JSON.parse(v); if (obj?.slotStart) lockedStarts.add(new Date(obj.slotStart).toISOString()); } catch {}
    }
  }

  return slots
    .filter(s => !bookedSet.has(s.start.toISOString()) && !lockedStarts.has(s.start.toISOString()))
    .sort((a, b) => a.start - b.start);
}