class NotFoundError extends Error {
	constructor(resource) {
		super(`${resource} not found`);
		this.statusCode = 404;
		this.name = 'NotFoundError';
	}
};

module.exports = NotFoundError;