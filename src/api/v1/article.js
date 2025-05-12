const asyncHandler = require('express-async-handler');
const { Router } = require('express');
const router = Router();
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// TODO:
// add authorization for some routes
// convert req.params.? into integer
// implement custom error handling?

// Articles
// Get all published articles
router.get('/', asyncHandler(async (req, res) => {
	const articles = await prisma.article.findMany({
		where: {
			published: true,
		}
	});
	res.json(articles);
}));
// Create and return article
router.post('/', asyncHandler(async (req, res) => {
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
}));
// Get article
router.get('/:articleId', asyncHandler(async (req, res) => {
	const article = await prisma.article.findUnique({
		where: {
			id: req.params.articleId,
		}
	});
	res.json(article);
}));
// Update article
router.put('/:articleId', asyncHandler(async (req, res) => {
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
}));
// Delete article
router.delete('/:articleId', asyncHandler(async (req, res) => {
	// need authorization
	const deleteArticle = await prisma.article.delete({
		where: {
			id: req.params.articleId,
		}
	});
	res.json(deleteArticle);
}));
// Comments
// Get all article comments
router.get('/:articleId/comments', asyncHandler(async (req, res) => {
	const comments = await prisma.comment.findMany({
		where: {
			articleId: req.params.articleId,
		}
	});
	res.json(comments);
}));
// Create article comment
router.post('/:articleId/comments', asyncHandler(async (req, res) => {
	// need authorization
	const comment = await prisma.comment.create({
		data: {
			text: 'hello there! user comment here',
			userId: 1,
			articleId: 1,
		}
	});
	res.json(comment);
}));
// Get article comment
router.get('/:articleId/comments/:commentId', asyncHandler(async (req, res) => {
	const comment = await prisma.comment.findUnique({
		where: {
			id: req.params.commentId,
		}
	});
	res.json(comment);
}));
// Update article comment
router.put('/:articleId/comments/:commentId', asyncHandler(async (req, res) => {
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
}));
// Delete article comment
router.delete('/:articleId/comments/:commentId', asyncHandler(async (req, res) => {
	// need authorization
	const deleteComment = await prisma.comment.delete({
		where: {
			id: req.params.commentId,
		}
	});
	res.json(deleteComment);
}));

module.exports = router;
