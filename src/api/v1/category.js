const { Router } = require('express');
const router = Router();
// TODO: add authentication and authorization 
// This is accessible to public
router.get('/', (req, res) => {
	// return all categories
});

router.post('/', (req, res) => {
	// create category
});

router.put('/:categoryId', (req, res) => {
	// update category
});

router.delete('/:categoryId', (req, res) => {
	// delete category
});
// This is accessible to public
router.get('/:categoryId/articles', (req, res) => {
	// return all articles from the given category
});

module.exports = router;