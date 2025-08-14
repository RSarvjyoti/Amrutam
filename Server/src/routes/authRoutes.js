import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { signup, login, refresh } from '../controllers/authController.js';
import { rateLimit } from '../middleware/rateLimit.js';

export const authRoutes = Router();

authRoutes.post('/signup', rateLimit({ windowSeconds: 60, max: 20 }), asyncHandler(signup));
authRoutes.post('/login', rateLimit({ windowSeconds: 60, max: 30 }), asyncHandler(login));
authRoutes.post('/refresh', asyncHandler(refresh));