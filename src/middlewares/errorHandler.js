/**
 * ============================================================
 * CENTRALIZED ERROR HANDLING MIDDLEWARE
 * ============================================================
 * In Express, error-handling middleware functions are defined
 * with 4 arguments: (err, req, res, next).
 *
 * When an error is passed via `next(err)`, Express skips all
 * regular route handlers and delegates directly to this function.
 */
const errorHandler = (err, req, res, next) => {
  console.error(' [Error Handler Caught]:', err.message);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle common PostgreSQL Error Codes
  // https://www.postgresql.org/docs/current/errcodes-appendix.html
  if (err.code === '23505') {
    // Unique violation
    statusCode = 409;
    message = 'Duplicate key error: A record with this value already exists.';
  } else if (err.code === '23503') {
    // Foreign key violation
    statusCode = 400;
    message = 'Referenced entity does not exist.';
  } else if (err.code === '23514') {
    // Check constraint violation
    statusCode = 400;
    message = 'Check constraint failed (e.g. price must be positive).';
  } else if (err.code === '28P01') {
    // Invalid password
    statusCode = 500;
    message = 'Database authentication failed. Check DB_PASSWORD in .env';
  } else if (err.code === 'ECONNREFUSED') {
    // Connection refused
    statusCode = 503;
    message = 'Cannot connect to database. Ensure PostgreSQL service is running.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only include stack trace in development
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

/**
 * 404 Handler for undefined routes
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - Endpoint ${req.originalUrl} does not exist on this server`,
  });
};

module.exports = { errorHandler, notFound };
