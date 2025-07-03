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

		const categories = await prisma.category.findMany();

		const users = await prisma.user.findMany({
			select: {
				id: true,
				author: true,
			},
		});

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

		res.status(200).json({ articles, categories, users, comments });
	})
];

module.exports = {
	getDashboard,
};
