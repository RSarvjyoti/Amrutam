import { redis } from '../config/redis.js';

export function rateLimit({ windowSeconds = 60, max = 100, keyFn }) {
  return async (req, res, next) => {
    try {
      const key = keyFn ? keyFn(req) : `rl:${req.ip}:${req.path}`;
      const now = Date.now();
      const ttl = windowSeconds;
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, ttl);
      if (count > max) return res.status(429).json({ message: 'Too many requests' });
      res.set('X-RateLimit-Limit', String(max));
      res.set('X-RateLimit-Remaining', String(Math.max(0, max - count)));
      res.set('X-RateLimit-Reset', String(Math.floor((await redis.ttl(key)) || ttl)));
      next();
    } catch (e) {
      next(e);
    }
  };
}