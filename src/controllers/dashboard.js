const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const { authUser, authAuthor } = require('../middleware/auth');

// TODO:
// - Optimization: instead of fetching all items do:
//  add take: 5, property to get only last 5 items
//  use prisma.article.count(); to get article count

// Dashboard
// Get colleciton of data needed for CMS dashboard
const getDashboard = [
	authUser,
	authAuthor,
	asyncHandler(async (req, res) => {
		// Get articles
		const articles = await prisma.article.findMany({
			orderBy: [
				{
					createdAt: "desc",
				},
			],
			select: {
				id: true,
				title: true,
				published: true,
				createdAt: true,
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
		// Get comments
		const comments = await prisma.comment.findMany({
			orderBy: [
				{
					createdAt: "desc",
				},
			],
			select: {
				id: true,
				comment: true,
				createdAt: true,
			},
		});

		res.status(200).json({ 
			articles,
			categories,
			topCategory,
			users,
			comments,
		});
	})
];

module.exports = {
	getDashboard,
};
