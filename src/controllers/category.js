const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const { authUser, authAuthor } = require('../middleware/auth');
const validateId = require('../utils/validateId');

// TODO: 
// implement form validation

const getAllCategories = asyncHandler(async (req, res) => {
	const categories = await prisma.category.findMany();
	res.status(200).json(categories);
});

const createCategory = [
	authUser,
	authAuthor,
	asyncHandler(async (req, res) => {
		// sanitize and validate

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
	asyncHandler(async (req, res) => {
		// sanitize and validate input

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

		if (articleCount > 0) {
			return res.status(400).json({ message: 'Cannot delete category: It has articles assigned to it' })
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
			categoryId: categoryId,
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
