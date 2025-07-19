import rateLimit from 'express-rate-limit';

export const teaPostRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: {
    statusCode: 429,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
