import rateLimit from 'express-rate-limit';

export default function limit() {
  return rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Too many requests, try again later.',
    standardHeaders: true,
    legacyHeaders: false
  });
}
