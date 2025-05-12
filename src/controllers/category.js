const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// TODO: 
// add authentication and authorization
// convert req.params.? into integer
// implement custom error handling?

const getAllCategories = asyncHandler(async (req, res) => {
	const categories = await prisma.category.findMany();
	res.json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
	// This needs user authorization
	// sanitize andauthenticate received data first
	// get data from req.body

	const category = await prisma.category.create({
		data: {
			name: 'Roman',
		}
	});
	res.json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
	// This needs user authorization
	const updateCategory = await prisma.category.update({
		where: {
			id: req.params.categoryId,
		},
		data: {
			name: 'Roman - updated',
		}
	});
	res.json(updateCategory);
});

const deleteCategory = asyncHandler(async (req, res) => {
	// This needs user authorization
	const deleteCategory = await prisma.category.delete({
		where: {
			id: req.params.categoryId,
		}
	});
	res.json(deleteCategory);
});

const getAllCategoryArticles = asyncHandler(async (req, res) => {
	const articles = await prisma.article.findMany({
		where: {
			categoryId: req.params.categoryId,
		}
	});
	res.json(articles);
});

module.exports = {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory,
	getAllCategoryArticles,
};