/**
 * Rate Limiter Middleware
 * Prevents API abuse by limiting requests per IP address
 * 
 * @module middleware/rateLimiter
 */

import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * Limits all API endpoints to prevent abuse
 */
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 15, // 15 requests per minute
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 60
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait a moment before trying again.',
      retryAfter: 60
    });
  }
});

/**
 * Strict rate limiter for AI endpoints
 * More restrictive for expensive AI operations
 */
export const aiLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 10, // 10 requests per minute for AI endpoints
  message: {
    success: false,
    error: 'AI request limit reached. Please wait before making another request.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    console.warn(`AI rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many AI requests. Please wait 60 seconds before continuing.',
      retryAfter: 60
    });
  }
});

/**
 * Diagnosis rate limiter
 * Very strict limit for final diagnosis generation
 */
export const diagnosisLimiter = rateLimit({
  windowMs: 300000, // 5 minutes
  max: 5, // 5 diagnosis requests per 5 minutes
  message: {
    success: false,
    error: 'Diagnosis request limit reached. Please wait before generating another diagnosis.',
    retryAfter: 300
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`Diagnosis rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many diagnosis requests. Please wait 5 minutes before trying again.',
      retryAfter: 300
    });
  }
});