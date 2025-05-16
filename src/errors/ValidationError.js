class ValidationError extends Error {
	constructor(message = 'Validation failed', errors) {
		super(message);
		this.statusCode = 400;
		this.name = 'ValidationError';
		this.errors = errors || [{ msg: message }];
	}
};

module.exports = ValidationError;
