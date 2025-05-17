const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const { authUser, authAuthor } = require('../middleware/auth');
const validateId = require('../utils/validateId');

// TODO: 
// form field sanitization and validation

const userSelect = {
	id: true,
	email: true,
	username: true,
	author: true,
};

const getAllUsers = asyncHandler(async (req, res) => {
	const users = await prisma.user.findMany({
		select: userSelect,
	});
	res.status(200).json(users);
});

const createUser = [
	authUser,
	authAuthor,
	asyncHandler(async (req, res) => {
		// validate and sanitize data
		const hashedPass = await bcrypt.hash(req.body.password, 10);
		const author = req.body.author === 'on' ? true : false;

		const user = await prisma.user.create({
			data: {
				email: req.body.email,
				username: req.body.username,
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
	asyncHandler(async (req, res) => {
		// validate and sanitize data
		const userId = validateId(req.params.userId, 'user');

		const author = req.body.author === 'on' ? true : false;

		const updatedUser = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				email: req.body.email,
				username: req.body.username,
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
			return res.status(403).json({ message: "Forbidden: Cannot delete author" });
		};

		await prisma.user.delete({
			where: { 
				id: userId
			}
		});

		res.status(200).json({ message: 'User deleted successfully' });
	}
)];

const getAllUserArticles = [
		authUser,
		asyncHandler(async (req, res) => {
		const userId = validateId(req.params.userId, 'user');

		const { published } = req.query;
		// Unpublished articles require authorization check
		if (published === 'false' && !req.user?.author) {
			return res.status(403).json({ message: "Forbidden access: Authors only"});
		};

		const userArticles = await prisma.article.findMany({
			where: {
				userId: userId,
				published: published === 'false' ? false : true,
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
	}
)];

const getAllUserComments = [
		authUser,
		asyncHandler(async (req, res) => {
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
	}
)];

module.exports = {
	getAllUsers,
	createUser,
	getUser,
	updateUser,
	deleteUser,
	getAllUserArticles,
	getAllUserComments,
};
