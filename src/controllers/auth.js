const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validateRegister, validateLogin } = require('../middleware/validation');
const validationErrorHandler = require('../middleware/validationErrorHandler');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');

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
	(req, res, next) => {
		passport.authenticate('local', 
			{ session: false }, 
			(err, user, info) => {
				if (err || !user) {
					return res.status(401).json({ 
						message: info ? info.message : 'Authentication failed' 
					});
				};

				const accessToken = generateAccessToken(user);
				const refreshToken = generateRefreshToken(user);

				res.json({ accessToken, refreshToken });
			}
		)(req, res, next);
	}
];

const refreshToken = (req, res) => {
	const refreshToken = req.body.refreshToken;

	if (!refreshToken) {
		return res.status(403).json({ message: 'No refresh token provided' });
	}

	jwt.verify(
		refreshToken,
		process.env.JWT_REFRESH_SECRET,
		async (err, payload) => {
			if (err) {
				return res.status(403).json({ message: 'Invalid or expired refresh token' });
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
};

module.exports = {
	register,
	login,
	refreshToken,
};
