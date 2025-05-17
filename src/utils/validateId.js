const ValidationError = require('../errors/ValidationError');
// Check if param id is valid
const validateId = (id, param) => {
	const checkId = Number(id);
	if (isNaN(checkId)) {
		throw new ValidationError(`Invalid ${param} ID format`);
	}
	return checkId;
};

module.exports = validateId;
