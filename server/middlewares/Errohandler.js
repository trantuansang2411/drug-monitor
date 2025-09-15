// middlewares/Errohandler.js

// Error handler middleware for handling different types of errors
const errorHandler = (err, req, res, next) => {
    console.error('Error Stack:', err.stack);

    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = {
            message,
            statusCode: 404
        };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = {
            message,
            statusCode: 400
        };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = {
            message,
            statusCode: 400
        };
    }

    // Check if request expects JSON response (API calls)
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1) || req.originalUrl.startsWith('/api/')) {
        // Return JSON for AJAX/API requests
        return res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }

    // Render error page for regular page requests
    if (error.statusCode === 404) {
        return res.status(404).render('error404', {
            title: 'Page Not Found',
            error: error.message
        });
    }

    // For other errors, render generic error page
    res.status(error.statusCode || 500).render('error404', {
        title: 'Server Error',
        error: error.message || 'Internal Server Error'
    });
};

// Enhanced 404 handler
const notFound = (req, res, next) => {
    // Check if it's an API request
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(404).json({
            success: false,
            error: `API endpoint not found - ${req.originalUrl}`
        });
    }

    // Silent 404 for common static files (no error logging)
    const staticFileExtensions = ['.ico', '.png', '.jpg', '.jpeg', '.gif', '.css', '.js', '.webmanifest', '.xml', '.txt'];
    const isStaticFile = staticFileExtensions.some(ext => req.originalUrl.toLowerCase().endsWith(ext));

    if (isStaticFile) {
        return res.status(404).send('File not found');
    }

    // For regular page requests, create error and pass to error handler
    const error = new Error(`Page not found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

// Async handler wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Custom error class
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = {
    errorHandler,
    notFound,
    asyncHandler,
    ErrorResponse
};