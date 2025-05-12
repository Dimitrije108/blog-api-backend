const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// TODO:
// add authorization for some routes
// convert req.params.? into integer
// implement custom error handling?

// Articles
const getAllArticles = asyncHandler(async (req, res) => {
	const articles = await prisma.article.findMany({
		where: {
			published: true,
		}
	});
	res.json(articles);
});

const createArticle = asyncHandler(async (req, res) => {
	// need authorization

	// get all required data to publish an article
	// from req.body?
	// publish should be a select box, true/false

	// MAKE SURE USER AND ID 1 EXIST BEFORE CALLING

	const article = await prisma.article.create({
		data: {
			title: 'Early Roman Archaeology on Serbian Limes',
			text: 'This is just example text from article that will be published',
			published: true,
			userId: 1,
			categoryId: 1,
		}
	});
	res.json(article);
});

const getArticle = asyncHandler(async (req, res) => {
	const article = await prisma.article.findUnique({
		where: {
			id: req.params.articleId,
		}
	});
	res.json(article);
});

const updateArticle = asyncHandler(async (req, res) => {
	// need authorization
	// extract data from req.body and pass it on
	const updateArticle = await prisma.article.update({
		where: {
			id: req.params.articleId,
		},
		data: {
			title: 'Early Roman Archaeology on Serbian Limes',
			text: 'This is just example text from article that is now updated!',
			published: true,
			categoryId: 1,
		}
	});
	res.json(updateArticle);
});

const deleteArticle = asyncHandler(async (req, res) => {
	// need authorization
	const deleteArticle = await prisma.article.delete({
		where: {
			id: req.params.articleId,
		}
	});
	res.json(deleteArticle);
});
// Comments
const getAllComments = asyncHandler(async (req, res) => {
	const comments = await prisma.comment.findMany({
		where: {
			articleId: req.params.articleId,
		}
	});
	res.json(comments);
});

const createComment = asyncHandler(async (req, res) => {
	// need authorization
	const comment = await prisma.comment.create({
		data: {
			text: 'hello there! user comment here',
			userId: 1,
			articleId: 1,
		}
	});
	res.json(comment);
});

const getComment = asyncHandler(async (req, res) => {
	const comment = await prisma.comment.findUnique({
		where: {
			id: req.params.commentId,
		}
	});
	res.json(comment);
});

const updateComment = asyncHandler(async (req, res) => {
	// need authorization
	const updateComment = await prisma.comment.update({
		where: {
			id: req.params.commentId,
		},
		data: {
			text: 'hello again! soooo this was just updated...',
		}
	});
	res.json(updateComment);
});

const deleteComment = asyncHandler(async (req, res) => {
	// need authorization
	const deleteComment = await prisma.comment.delete({
		where: {
			id: req.params.commentId,
		}
	});
	res.json(deleteComment);
});

module.exports = {
	getAllArticles,
	createArticle,
	getArticle,
	updateArticle,
	deleteArticle,
	getAllComments,
	createComment,
	getComment,
	updateComment,
	deleteComment,
};