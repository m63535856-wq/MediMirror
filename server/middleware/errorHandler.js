/**
 * Error Handler Middleware
 * Centralized error handling for the Express application
 * Ensures consistent error responses and logging
 * 
 * @module middleware/errorHandler
 */

/**
 * Global error handler middleware
 * Catches all errors and formats them consistently
 * 
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  // Log error details server-side only
  console.error('Error occurred:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Prepare error response
  const errorResponse = {
    success: false,
    error: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 * Handles routes that don't exist
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors automatically
 * 
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function with error handling
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};