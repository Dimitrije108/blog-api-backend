const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const error = err.name || 'Error';
	const message = err.message || 'Internal Server Error';
	// Validation errors
	const details = err.details || [];

	const response = {
		error,
		message,
		details,
	};

	res.status(statusCode).json(response)
};

module.exports = errorHandler;
