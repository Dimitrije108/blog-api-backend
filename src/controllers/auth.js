const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const validateRegister = [
	body('name').trim()
		.isAlpha().withMessage('Name must only contain letters.')
		.isLength({ min: 1, max: 30 }).withMessage('Name must be between 1 and 30 characters.'),
	body('email').normalizeEmail()
		.isEmail().withMessage('Email must be a valid email address.'),
	body('password').trim()
		.isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.'),
	body('confirmPass').trim()
		.custom(async (value, { req }) => {
			if (value === req.body.password) {
				return true;
			}
			throw new Error('Confirm password must match the password.');
		}),
];

const validateLogin = [
	body('email').normalizeEmail()
		.isEmail().withMessage('Email must be a valid email address.'),
	body('password').trim()
		.notEmpty().withMessage('Password cannot be empty.'),
];

const generateAccessToken = (user) => {
	return jwt.sign(
		{ id: user.id, email: user.email, author: user.author },
		process.env.JWT_SECRET,
    { expiresIn: '1h' }
	);
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

const register = [
	validateRegister,
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		};
		
		const { username, email } = req.body;
		const hashedPass = await bcrypt.hash(req.body.password, 10);
		await prisma.user.create({
			data: {
				email,
				username,
				password: hashedPass,
			}
		});

		res.status(201).json({ message: 'Userr registered successfully' });
	})
];

const login = [
	validateLogin,
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		};

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

				res.json({ accessToken });
				res.cookie('refreshToken', refreshToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					maxAge: 7 * 24 * 60 * 60 * 1000,
				});
			}
		)(req, res, next);
	}
];

const refreshToken = (req, res) => {
	const refreshToken = req.cookies.refreshToken;

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

			const user = await prisma.user.findUnique({
				where: { id: payload.id },
			});

			if (!user) {
				return res.status(403).json({ message: 'User not found' });
			};

			const newAccessToken = generateAccessToken(user);
			const newRefreshToken = generateRefreshToken(user);

			res.json({ accessToken: newAccessToken });
			res.cookie('refreshToken', newRefreshToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					maxAge: 7 * 24 * 60 * 60 * 1000,
				});
		}
	);
};

const logout = (req, res) => {
	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'Strict',
	});
	res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
	register,
	login,
	refreshToken,
	logout,
};
