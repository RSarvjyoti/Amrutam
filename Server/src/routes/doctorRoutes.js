import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { createDoctor, listDoctors, addAvailabilityRule, getAvailability } from '../controllers/doctorController.js';
import { auth, requireRole } from '../middleware/auth.js';

export const doctorRoutes = Router();

doctorRoutes.get('/', asyncHandler(listDoctors));

doctorRoutes.post('/', auth(true), requireRole('admin'), asyncHandler(createDoctor));

doctorRoutes.post('/:id/availability', auth(true), requireRole('doctor'), asyncHandler(addAvailabilityRule));

doctorRoutes.get('/:id/availability', asyncHandler(getAvailability));