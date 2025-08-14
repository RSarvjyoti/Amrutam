import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { ok, created } from '../utils/responses.js';
import { signAccess, signRefresh, verifyRefresh } from '../utils/jwt.js';
import { assert } from '../utils/validator.js';

export const signup = async (req, res) => {
  const { name, email, phone, password, roles } = req.body;
  
  assert(name && email && phone && password, 'Missing fields');

  const exists = await User.findOne({ $or: [{ email }, { phone }] });
  assert(!exists, 'User already exists', 409);

  const passwordHash = await bcrypt.hash(password, 10);

  const assignedRoles = roles && roles.length > 0 ? roles : ['user'];

  const user = await User.create({ 
    name, 
    email, 
    phone, 
    passwordHash, 
    roles: assignedRoles 
  });

  const accessToken = signAccess(user);
  const refreshToken = signRefresh(user);

  return created(res, { 
    user: { 
      id: user._id, 
      name, 
      email, 
      phone, 
      roles: user.roles 
    }, 
    accessToken, 
    refreshToken 
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  assert(email && password, 'Missing fields');
  const user = await User.findOne({ email });
  assert(user, 'Invalid credentials', 401);
  const okPass = await bcrypt.compare(password, user.passwordHash);
  assert(okPass, 'Invalid credentials', 401);
  const accessToken = signAccess(user);
  const refreshToken = signRefresh(user);
  return ok(res, { user: { id: user._id, name: user.name, email: user.email, phone: user.phone, roles: user.roles }, accessToken, refreshToken });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  assert(refreshToken, 'Missing refreshToken');
  const payload = verifyRefresh(refreshToken);
  const user = await User.findById(payload.id);
  assert(user, 'User not found', 404);
  const accessToken = signAccess(user);
  return ok(res, { accessToken });
};