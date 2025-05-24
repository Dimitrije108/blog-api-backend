class ValidationError extends Error {
	constructor(message = 'Validation failed', errors = []) {
		super(message);
		this.statusCode = 400;
		this.name = 'ValidationError';
		this.details = errors.map(err => ({
			field: err.path,
			message: err.msg,
		}));
	}
};

module.exports = ValidationError;
