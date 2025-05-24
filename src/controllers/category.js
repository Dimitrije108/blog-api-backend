const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const { authUser, authAuthor } = require('../middleware/auth');
const validateId = require('../utils/validateId');
const { validateCategory } = require('../middleware/validation');
const validationErrorHandler = require('../middleware/validationErrorHandler');

const getAllCategories = asyncHandler(async (req, res) => {
	const categories = await prisma.category.findMany();
	res.status(200).json(categories);
});

const createCategory = [
	authUser,
	authAuthor,
	validateCategory,
	validationErrorHandler,
	asyncHandler(async (req, res) => {
		const { name } = req.body;

		const category = await prisma.category.create({
			data: {
				name
			}	
		});

		res.status(201).json(category);
	}
)];

const updateCategory = [
	authUser,
	authAuthor,
	validateCategory,
	validationErrorHandler,
	asyncHandler(async (req, res) => {
		const categoryId = validateId(req.params.categoryId, 'category');

		const { name } = req.body;

		const updatedCategory = await prisma.category.update({
			where: {
				id: categoryId
			},
			data: {
				name
			}
		});

		res.status(200).json(updatedCategory);
	}
)];

const deleteCategory = [
	authUser,
	authAuthor,
	asyncHandler(async (req, res) => {
		const categoryId = validateId(req.params.categoryId, 'category');

		const articleCount = await prisma.article.count({
			where: {
				categoryId
			}
		});
		// Check if category has articles assigned
		if (articleCount > 0) {
			return res.status(400).json({ 
				error: 'CategoryHasArticlesError',
				message: 'Cannot delete category because it has articles assigned.' 
			})
		};

		const deletedCategory = await prisma.category.delete({
			where: {
				id: categoryId,
			}
		});

		res.status(200).json(deletedCategory);
	}
)];

const getAllCategoryArticles = asyncHandler(async (req, res) => {
	const categoryId = validateId(req.params.categoryId, 'category');

	const articles = await prisma.article.findMany({
		where: {
			categoryId,
			published: true
		},
		include: {
			user: {
				select: {
					username: true
				}
			}
		}
	});

	res.status(200).json(articles);
});

module.exports = {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory,
	getAllCategoryArticles,
};
