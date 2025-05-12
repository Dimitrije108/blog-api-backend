const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// TODO: add authentication and authorization
// convert req.params.? into integer
// implement custom error handling?

const getAllUsers = asyncHandler(async (req, res) => {
	const users = await prisma.user.findMany();
	res.json(users);
});

const createUser = asyncHandler(async (req, res) => {
	// needs authorization
	// get it from req.body
	const user = await prisma.user.create({
		data: {
			email: req.body.email,
			username: req.body.username,
			password: hashedPass,
			author: isAuthor,
		}
	});
	res.json(user);
});

const getUser = asyncHandler(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			id: req.params.userId,
		}
	});
	res.json(user);
});

const updateUser = asyncHandler(async (req, res) => {
	// needs authorization
	const updateUser = await prisma.user.update({
		where: {
			id: req.params.userId,
		},
		data: {
			email: req.body.email,
			username: req.body.username,
			author: isAuthor,
		}
	});
	res.json(updateUser);
});

const deleteUser = asyncHandler(async (req, res) => {
	// needs authorization
	const deleteUser = await prisma.user.delete({
		where: {
			id: req.params.userId,
		}
	});
	res.json(deleteUser);
});

const getAllUserArticles = asyncHandler(async (req, res) => {
	// maybe check if they are author and then have a custom response
	const userArticles = await prisma.article.findMany({
		where: {
			userId: req.params.userId,
		}
	});
	res.json(userArticles);
});

const getAllUserComments = asyncHandler(async (req, res) => {
	const userComments = await prisma.comment.findMany({
		where: {
			userId: req.params.userId,
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