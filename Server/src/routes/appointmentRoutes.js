import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { auth } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { lockSlot, confirmSlot, cancelAppointment, rescheduleAppointment, listAppointments, getAppointment } from '../controllers/appointmentController.js';

export const appointmentRoutes = Router();

appointmentRoutes.post('/lock', auth(true), rateLimit({ windowSeconds: 60, max: 50 }), asyncHandler(lockSlot));
appointmentRoutes.post('/confirm', auth(true), rateLimit({ windowSeconds: 60, max: 50 }), asyncHandler(confirmSlot));
appointmentRoutes.get('/', auth(true), asyncHandler(listAppointments));
appointmentRoutes.get('/:id', auth(true), asyncHandler(getAppointment));
appointmentRoutes.post('/:id/cancel', auth(true), asyncHandler(cancelAppointment));
appointmentRoutes.put('/:id/reschedule', auth(true), asyncHandler(rescheduleAppointment));