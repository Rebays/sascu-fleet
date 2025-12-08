const errorHandler = (err, req, res, next) => {
  // Default error status & message
  let error = { ...err };
  error.message = err.message;

  console.log('ERROR:', err); // Keep this in dev, remove or use winston in production

  // Mongoose: Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.statusCode = 404;
  }

  // Mongoose: Duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error.statusCode = 400;
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error.message = messages.join(', ');
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  // Set status code
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    // Only show stack trace in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;