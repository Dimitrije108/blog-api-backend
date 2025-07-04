const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const { authUser, authAuthor } = require('../middleware/auth');

// Dashboard
// Get colleciton of data needed for CMS dashboard
const getDashboard = [
	authUser,
	authAuthor,
	asyncHandler(async (req, res) => {
		// Get article count
		const articleCount = await prisma.article.count();
		// Get the latest article
		const latestArticle = await prisma.article.findFirst({
			orderBy: {
				createdAt: "desc",
			},
		});
		// Get number of published articles
		const publishedCount = await prisma.article.count({
			where: {
				published: true,
			},
		});
		// Get number of unpublished articles
		const unpublishedCount = await prisma.article.count({
			where: {
				published: false,
			},
		});
		// Get categories
		const categories = await prisma.category.findMany();
		// Get most used category
		const mostUserCategories = await prisma.article.groupBy({
			by: ["categoryId"],
			_count: {
				categoryId: true,
			},
			orderBy: {
				_count: {
					categoryId: "desc",
				},
			},
		});

		const topCategory = await prisma.category.findUnique({
			where: { 
				id:  mostUserCategories[0].categoryId
			},
		});
		// Get users
		const users = await prisma.user.findMany({
			select: {
				id: true,
				author: true,
			},
		});
		// Get authors
		const authors = await prisma.user.findMany({
			where: {
				author: true,
			},
			select: {
				id: true,
				author: true,
			},
		});
		// Get comment count
		const commentCount = await prisma.comment.count();
		// Get the latest comment
		const latestComment = await prisma.article.findFirst({
			orderBy: {
				createdAt: "desc",
			},
			include: {
				user: {
					select: {
						username: true,
					},
				},
			},
		});

		res.status(200).json({
			articleCount,
			latestArticle,
			publishedCount,
			unpublishedCount,
			categories,
			topCategory,
			users,
			authors,
			commentCount,
			latestComment,
		});
	})
];

module.exports = {
	getDashboard,
};
