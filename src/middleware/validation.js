const { body } = require('express-validator');
const cleanHTML = require('../utils/sanitizeHtml');

const validateRegister = [
	body('username').trim()
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

const validateArticle = [
	body('title').trim()
		.isLength({ min: 1, max: 70 }).withMessage('Title must be between 1 and 70 characters long.'),
	body('content')
		.customSanitizer((value) => cleanHTML(value))
		.isLength({ min: 1000, max: 10000 }).withMessage('Content must be between 1000 and 10000 characters long.'),
];

const validateComment = [
	body('comment').trim()
		.isLength({ min: 1, max: 300 }).withMessage('Comment must be between 1 and 300 characters long.'),
];

const validateCategory = [
	body('name').trim()
		.isLength({ min: 1, max: 50 }).withMessage('Category must be between 1 and 50 characters long.'),
];

module.exports = {
	validateRegister,
	validateLogin,
	validateArticle,
	validateComment,
	validateCategory,
};
