const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/response');

const customHandler = (req, res, next, options) => {
  return sendError(res, 'Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau.', 429);
};

// Rate limit for auth (login, register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: customHandler
});

// Rate limit for recommendations
const recommendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: customHandler
});

// Rate limit for main API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: customHandler
});

module.exports = {
  authLimiter,
  recommendLimiter,
  apiLimiter
};
