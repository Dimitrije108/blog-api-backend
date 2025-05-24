const prismaErrorHandler = (err, req, res, next) => {
	if (err.code === 'P2002') {
		return res.status(409).json({
			error: 'Conflict',
			message: `A record with this value already exists`,
			details: err.meta?.target?.map(field => ({
        field
      })) || [],
		})
	};

	if (err.code === 'P2003') {
		return res.status(400).json({ 
			error: 'ForeignKeyError',
			message: 'Related record does not exist',
		})
	};

	if (err.code === 'P2025') {
		return res.status(404).json({
			error: 'NotFound',
			message: 'Record not found',
		})
	};

	next(err);
};

module.exports = prismaErrorHandler;
