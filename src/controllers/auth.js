const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validateRegister, validateLogin } = require('../middleware/validation');
const validationErrorHandler = require('../middleware/validationErrorHandler');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const ForbiddenError = require('../errors/ForbiddenError');

const register = [
	validateRegister,
	validationErrorHandler,
	asyncHandler(async (req, res) => {
		const { username, email } = req.body;
		const hashedPass = await bcrypt.hash(req.body.password, 10);

		await prisma.user.create({
			data: {
				email,
				username,
				password: hashedPass,
			}
		});

		res.status(201).json({ message: 'User registered successfully' });
	})
];

const login = [
	validateLogin,
	validationErrorHandler,
	asyncHandler(async (req, res, next) => {
		passport.authenticate('local', 
			{ session: false }, 
			(err, user, info) => {
				try {
					if (err) return next(err);
					if (!user) {
						return res.status(401).json({ 
							error: 'UnauthorizedError',
							message: info ? info.message : 'Authentication failed' 
						});
					};

					const accessToken = generateAccessToken(user);
					const refreshToken = generateRefreshToken(user);

					res.json({ accessToken, refreshToken });
				} catch (error) {
					next(error);
				}
			}
		)(req, res, next);
	})
];

const refreshToken = asyncHandler(async (req, res) => {
	const refreshToken = req.body.refreshToken;

	if (!refreshToken) {
		throw new ForbiddenError('No refresh token provided');
	};

	jwt.verify(
		refreshToken,
		process.env.JWT_REFRESH_SECRET,
		async (err, payload) => {
			if (err) {
				throw new ForbiddenError('Invalid or expired refresh token');
			}

			const user = await prisma.user.findUniqueOrThrow({
				where: { id: payload.id },
			});
			// Create new tokens
			const accessToken = generateAccessToken(user);
			const refreshToken = generateRefreshToken(user);

			res.json({ accessToken, refreshToken });
		}
	);
});

module.exports = {
	register,
	login,
	refreshToken,
};
