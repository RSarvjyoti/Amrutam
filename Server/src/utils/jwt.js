import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signAccess = (user) => jwt.sign({ id: user._id, roles: user.roles }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
export const signRefresh = (user) => jwt.sign({ id: user._id }, env.REFRESH_SECRET, { expiresIn: env.REFRESH_EXPIRES_IN });
export const verifyRefresh = (token) => jwt.verify(token, env.REFRESH_SECRET);