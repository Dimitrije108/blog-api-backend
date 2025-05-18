const { validationResult } = require('express-validator');
const ValidationError = require('../errors/ValidationError');

const validationErrorHandler = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		throw new ValidationError('Validation failer', errors.array());
	};

	next();
};

module.exports = validationErrorHandler;
