const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const { authUser, authAuthor } = require('../middleware/auth');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

// TODO:
// sanitize and validate form values
// implement custom error handling?

// Check if param id is valid
const validateId = (id, param) => {
	const checkId = Number(id);
	if (isNaN(checkId)) {
		throw new ValidationError(`Invalid ${param} ID format`);
	}
	return checkId;
};

// Articles
const getAllArticles = asyncHandler(async (req, res) => {
	const articles = await prisma.article.findMany({
		where: {
			published: true,
		}
	});

	res.status(200).json(articles);
});

const createArticle = [
	authUser,
	authAuthor,
	asyncHandler(async (req, res) => {
		// sanitize and validate form values
		// get article data from req.body
		// publish should be a select box, true/false

		// MAKE SURE USER AND CATEGORY ID 1 EXIST BEFORE CALLING

		// check if category exists before creating an article

		const article = await prisma.article.create({
			data: {
				title: 'Early Roman Archaeology on Serbian Limes',
				text: 'This is just example text from article that will be published',
				published: true,
				userId: 1,
				categoryId: 1,
			}
		});

		res.status(201).json(article);
	}
)];

const getArticle = asyncHandler(async (req, res) => {
	const articleId = validateId(req.params.articleId, 'article');

	const article = await prisma.article.findUnique({
		where: {
			id: articleId,
		}
	});

	if (!article) {
		throw new NotFoundError('Article');
	}

	res.status(200).json(article);
});

const updateArticle = [
	authUser,
	authAuthor,
	asyncHandler(async (req, res) => {
		// sanitize and validate form values
		// extract data from req.body and pass it on
		const articleId = validateId(req.params.articleId, 'article');
		
		const article = await prisma.article.findUnique({
			where: {
				id: articleId,
			}
		});
		// Check if article exists
		if (!article) {
			throw new NotFoundError('Article');
		};

		const updateArticle = await prisma.article.update({
			where: {
				id: articleId,
			},
			data: {
				title: 'Early Roman Archaeology on Serbian Limes',
				text: 'This is just example text from article that is now updated!',
				published: true,
				categoryId: 1,
			}
		});

		res.status(200).json(updateArticle);
	}
)];

const deleteArticle = [
	authUser,
	authAuthor,
	asyncHandler(async (req, res) => {
		const articleId = validateId(req.params.articleId, 'article');

		const article = await prisma.article.findUnique({
			where: {
				id: articleId,
			}
		});
		// Check if article exists
		if (!article) {
			throw new NotFoundError('Article');
		};

		const deleteArticle = await prisma.article.delete({
			where: {
				id: articleId,
			}
		});

		res.status(200).json(deleteArticle);
	}
)];
// Comments
const getAllComments = asyncHandler(async (req, res) => {
	const articleId = validateId(req.params.articleId, 'article');

	const comments = await prisma.comment.findMany({
		where: {
			articleId: articleId,
		}
	});

	res.status(200).json(comments);
});

const createComment = [
	authUser,
	asyncHandler(async (req, res) => {
		// verify article exists before creating a comment

		const comment = await prisma.comment.create({
			data: {
				text: 'hello there! user comment here',
				userId: 1,
				articleId: 1,
			}
		});

		res.status(201).json(comment);
	}
)];

const getComment = asyncHandler(async (req, res) => {
	const commentId = validateId(req.params.commentId, 'comment');

	const comment = await prisma.comment.findUnique({
		where: {
			id: commentId,
		}
	});
	// Check if comment exists
	if (!comment) {
		throw new NotFoundError('Comment');
	}

	res.status(200).json(comment);
});

const updateComment = [
	authUser,
	asyncHandler(async (req, res) => {
		const commentId = validateId(req.params.commentId, 'comment');
		const userId = validateId(req.user.id, 'user');
		// Find user comment
		const comment = await prisma.comment.findUnique({
			where: {
				id: commentId,
			}
		});
		// Check if comment exists
		if (!comment) {
			throw new NotFoundError('Comment');
		}
		// Check if user updating the comment is the one that created it
		if (comment.userId !== userId) {
			return res.status(403).json({ message: 'Forbidden: You can only edit your own comments' })
		}
		
		const updateComment = await prisma.comment.update({
			where: {
				id: commentId,
			},
			data: {
				text: 'hello again! soooo this was just updated...',
			}
		});

		res.status(200).json(updateComment);
	}
)];

const deleteComment = [
	authUser,
	asyncHandler(async (req, res) => {
		const commentId = validateId(req.params.commentId, 'comment');

		const comment = await prisma.comment.findUnique({
			where: {
				id: commentId,
			}
		});
		// Check if comment exists
		if (!comment) {
			throw new NotFoundError('Comment');
		};

		const deleteComment = await prisma.comment.delete({
			where: {
				id: commentId,
			}
		});

		res.status(200).json(deleteComment);
	}
)];

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
