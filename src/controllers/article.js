const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const { authUser, authAuthor, optionalAuth } = require('../middleware/auth');
const validateId = require('../utils/validateId');
const { validateArticle, validateComment } = require('../middleware/validation');
const validationErrorHandler = require('../middleware/validationErrorHandler');
const ForbiddenError = require('../errors/ForbiddenError');

// Articles
// Get all published articles by default
const getAllArticles = [
	optionalAuth,
	asyncHandler(async (req, res) => {
		const { published } = req.query;

		// Unpublished articles require authorization check
		if (published === "false" && !req.user?.author) {
			throw new ForbiddenError('Authors only');
		};

		const articles = await prisma.article.findMany({
			where: {
				published: published === 'false' ? false : true
			},
			include: {
				user: {
					select: {
						username: true
					}
				},
				category: {
					select: {
						name: true
					}
				}
			}
		});

		res.status(200).json(articles);
	})
];

const createArticle = [
	authUser,
	authAuthor,
	validateArticle,
	validationErrorHandler,
	asyncHandler(async (req, res) => {
		const { title, content, categoryId, published } = req.body;

		const article = await prisma.article.create({
			data: {
				title,
				content,
				published,
				userId: req.user.id,
				categoryId: Number(categoryId),
			}
		});

		res.status(201).json(article);
	})
];

const getArticle = asyncHandler(async (req, res) => {
	const articleId = validateId(req.params.articleId, 'article');

	const article = await prisma.article.findUniqueOrThrow({
		where: {
			id: articleId
		},
		include: {
			user: {
				select: {
					username: true,
				}
			},
			category: {
				select: {
					name: true
				}
			}
		}
	});

	res.status(200).json(article);
});

const updateArticle = [
	authUser,
	authAuthor,
	validateArticle,
	validationErrorHandler,
	asyncHandler(async (req, res) => {
		const articleId = validateId(req.params.articleId, 'article');

		const article = await prisma.article.findUniqueOrThrow({
			where: {
				id: articleId
			},
			select: {
				userId: true
			}
		});
		// Check if user updating the article is the one who created it
		if (article.userId !== req.user.id) {
			throw new ForbiddenError('You can only update your own articles');
		};

		const { title, content, categoryId } = req.body;
		const publish = req.body.publish === 'on' ? true : false;

		const updatedArticle = await prisma.article.update({
			where: {
				id: articleId
			},
			data: {
				title,
				content,
				published: publish,
				categoryId,
			}
		});

		res.status(200).json(updatedArticle);
	})
];

const updatePublishStatus = [
	authUser,
	authAuthor,
	asyncHandler(async (req, res) => {
		const articleId = validateId(req.params.articleId, 'article');
		const publish = req.body.publish;
		const publishMsg = publish ? "published" : "unpublished";

		await prisma.article.update({
			where: {
				id: articleId
			},
			data: {
				published: publish
			}
		});

		res.status(200).json({ message: `Article ${publishMsg}` });
	})
];

const deleteArticle = [
	authUser,
	authAuthor,
	asyncHandler(async (req, res) => {
		const articleId = validateId(req.params.articleId, 'article');

		const article = await prisma.article.findUniqueOrThrow({
			where: {
				id: articleId
			},
			select: {
				userId: true
			}
		});
		// Check if user deleting the article is the one who created it
		if (article.userId !== req.user.id) {
			throw new ForbiddenError('You can only delete your own articles');
		};

		const deleteArticle = await prisma.article.delete({
			where: {
				id: articleId
			}
		});

		res.status(200).json(deleteArticle);
	})
];
// Comments
const getAllComments = asyncHandler(async (req, res) => {
	const articleId = validateId(req.params.articleId, 'article');

	const comments = await prisma.comment.findMany({
		where: {
			articleId: articleId
		},
		include: {
			user: {
				select: {
					username: true,
					author: true,
				}
			}
		}
	});

	res.status(200).json(comments);
});

const createComment = [
	authUser,
	validateComment,
	validationErrorHandler,
	asyncHandler(async (req, res) => {
		const articleId = validateId(req.params.articleId, 'article');

		const { comment } = req.body;

		const userComment = await prisma.comment.create({
			data: {
				comment,
				userId: req.user.id,
				articleId,
			}
		});

		res.status(201).json(userComment);
	})
];

const getComment = asyncHandler(async (req, res) => {
	const commentId = validateId(req.params.commentId, 'comment');

	const comment = await prisma.comment.findUniqueOrThrow({
		where: {
			id: commentId
		},
		include: {
			user: {
				select: {
					username: true,
					author: true,
				}
			}
		}
	});

	res.status(200).json(comment);
});

const updateComment = [
	authUser,
	validateComment,
	validationErrorHandler,
	asyncHandler(async (req, res) => {
		const commentId = validateId(req.params.commentId, 'comment');
		
		const userComment = await prisma.comment.findUniqueOrThrow({
			where: {
				id: commentId
			}
		});
		// Check if user updating the comment is the one who created it
		if (userComment.userId !== req.user.id) {
			throw new ForbiddenError('You can only edit your own comments');
		};

		const { comment } = req.body;
		
		const updatedComment = await prisma.comment.update({
			where: {
				id: commentId
			},
			data: {
				comment
			}
		});

		res.status(200).json(updatedComment);
	})
];

const deleteComment = [
	authUser,
	asyncHandler(async (req, res) => {
		const commentId = validateId(req.params.commentId, 'comment');

		const comment = await prisma.comment.findUniqueOrThrow({
			where: {
				id: commentId
			}
		});
		// Check if user deleting the comment is the one who created it
		if (comment.userId !== req.user.id) {
			throw new ForbiddenError('You can only delete your own comments');
		};

		const deleteComment = await prisma.comment.delete({
			where: {
				id: commentId,
			}
		});

		res.status(200).json(deleteComment);
	})
];

module.exports = {
	getAllArticles,
	createArticle,
	getArticle,
	updateArticle,
	updatePublishStatus,
	deleteArticle,
	getAllComments,
	createComment,
	getComment,
	updateComment,
	deleteComment,
};
