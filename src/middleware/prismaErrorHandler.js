const prismaErrorHandler = (err, req, res, next) => {
	if (err.code === 'P2002') {
		return res.status(409).json({ 
			success: false,
			type: 'PrismaError',
			message: 'Unique constraint violation',
		})
	};

	if (err.code === 'P2003') {
		return res.status(400).json({ 
			success: false,
			type: 'PrismaError',
			message: 'Foreign key constraint failed',
		})
	};

	if (err.code === 'P2025') {
		return res.status(404).json({
			success: false,
			type: 'PrismaError',
			message: 'Record not found',
		})
	};

	next(err);
};

module.exports = prismaErrorHandler;
