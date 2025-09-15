const express = require('express');//we installed express using npm previously and we are indicating that it would be used here
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const connectDB = require('./server/database/connect');
const { errorHandler, notFound } = require('./server/middlewares/Errohandler');

const app = express();

dotenv.config();
const PORT = process.env.PORT || 8080;

// Global error handling for unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	// Close server & exit process
	server.close(() => {
		process.exit(1);
	});
});

// Global error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
	console.log(`Error: ${err.message}`.red);
	console.log('Shutting down due to uncaught exception');
	process.exit(1);
});

// Log requests
app.use(morgan('tiny'));

// MongoDB connection
connectDB();

// Parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json()); // Add JSON parsing

// Set view engine
app.set("view engine", "ejs");

// Load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")));
app.use('/img', express.static(path.resolve(__dirname, "assets/images")));
app.use('/js', express.static(path.resolve(__dirname, "assets/js")));
app.use('/images', express.static(path.resolve(__dirname, "assets/images")));
app.use('/favicon.ico', express.static(path.resolve(__dirname, "assets/images/favicon/favicon.ico")));

// Global middleware for logging all requests
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
	console.log('Headers:', req.headers);
	if (req.body && Object.keys(req.body).length > 0) {
		console.log('Body:', req.body);
	}
	next();
});

// Global middleware for setting response headers
app.use((req, res, next) => {
	res.header('X-Powered-By', 'Drug Monitor App');
	res.header('X-Frame-Options', 'DENY');
	res.header('X-Content-Type-Options', 'nosniff');
	next();
});

// Load routers
app.use('/', require('./server/routes/routes'));

// Global error handling middleware (must be after all routes)
app.use(notFound);       // 404 handler - when no route matches
app.use(errorHandler);   // General error handler

// Start server
const server = app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
	console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
	server.close(() => {
		console.log('💥 Process terminated!');
	});
});

process.on('SIGINT', () => {
	console.log('👋 SIGINT RECEIVED. Shutting down gracefully');
	server.close(() => {
		console.log('💥 Process terminated!');
		process.exit(0);
	});
});

module.exports = app;