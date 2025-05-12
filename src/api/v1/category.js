const { Router } = require('express');
const router = Router();
const controller = require('../../controllers/category');

// Get all categories
router.get('/', controller.getAllCategories);
// Create category
router.post('/', controller.createCategory);
// Update category
router.put('/:categoryId', controller.updateCategory);
// Delete category
router.delete('/:categoryId', controller.deleteCategory);
// Get all category articles
router.get('/:categoryId/articles', controller.getAllArticles);

module.exports = router;