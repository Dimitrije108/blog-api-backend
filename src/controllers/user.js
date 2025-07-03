const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const { authUser, authAuthor } = require('../middleware/auth');
const validateId = require('../utils/validateId');
const { 
	validateRegister, 
	validateUserUpdate 
} = require('../middleware/validation');
const validationErrorHandler = require('../middleware/validationErrorHandler');
const ForbiddenError = require('../errors/ForbiddenError');

const userSelect = {
	id: true,
	email: true,
	username: true,
	author: true,
	comments: true,
};

const getAllUsers = asyncHandler(async (req, res) => {
	const users = await prisma.user.findMany({
		select: { 
			...userSelect,
			articles: {
				select: {
					id: true,
					title: true,
					published: true,
					createdAt: true,
				}
			},
		}
	});
	res.status(200).json(users);
});

const createUser = [
	authUser,
	authAuthor,
	validateRegister,
	validationErrorHandler,
	asyncHandler(async (req, res) => {
		const { username, email, author } = req.body;
		const hashedPass = await bcrypt.hash(req.body.password, 10);

		const user = await prisma.user.create({
			data: {
				email,
				username,
				password: hashedPass,
				author,
			},
			select: userSelect,
		});

		res.status(201).json(user);
	}
)];

const getUser = asyncHandler(async (req, res) => {
	const userId = validateId(req.params.userId, 'user');

	const user = await prisma.user.findUniqueOrThrow({
		where: { id: userId },
		select: userSelect,
	});

	res.status(200).json(user);
});

const updateUser = [
	authUser,
	authAuthor,
	validateUserUpdate,
	validationErrorHandler,
	asyncHandler(async (req, res) => {
		const userId = validateId(req.params.userId, 'user');

		const { username, email, author } = req.body;

		const updatedUser = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				email,
				username,
				author,
			},
			select: userSelect,
		});

		res.status(200).json(updatedUser);
	}
)];

const deleteUser = [
	authUser,
	authAuthor,
	asyncHandler(async (req, res) => {
		const userId = validateId(req.params.userId, 'user');

		const user = await prisma.user.findUniqueOrThrow({
			where: {
				id: userId
			}
		});

		if (user.author) {
			throw new ForbiddenError('Cannot delete author');
		};

		await prisma.user.delete({
			where: { 
				id: userId
			}
		});

		res.status(200).json({ message: 'User deleted successfully' });
	}
)];

const getAllUserArticles = asyncHandler(async (req, res) => {
	const userId = validateId(req.params.userId, 'user');

	const { published } = req.query;
	const isPublished = published !== 'false';
	// Unpublished articles require authorization check
	if (published === 'false' && !req.user?.author) {
		throw new ForbiddenError('Authors only');
	};

	const userArticles = await prisma.article.findMany({
		where: {
			userId: userId,
			published: isPublished,
		},
		include: {
			user: {
				select: {
					username: true
				}
			}
		}
	});

	res.status(200).json(userArticles);
});

const getAllUserComments = asyncHandler(async (req, res) => {
	const userId = validateId(req.params.userId, 'user');

	const userComments = await prisma.comment.findMany({
		where: {
			userId: userId,
		},
		include: {
			user: {
				select: {
					username: true
				}
			}
		}
	});

	res.json(userComments);
});

module.exports = {
	getAllUsers,
	createUser,
	getUser,
	updateUser,
	deleteUser,
	getAllUserArticles,
	getAllUserComments,
};
