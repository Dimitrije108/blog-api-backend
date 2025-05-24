class ForbiddenError extends Error {
	constructor(message = 'Forbidden access') {
		super(message);
		this.statusCode = 403;
		this.name = 'Forbidden';
	}
};

module.exports = ForbiddenError;
