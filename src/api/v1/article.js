const { Router } = require('express');
const router = Router();
// Articles
router.get('/', (req, res) => {
	// return all articles
});

router.post('/', (req, res) => {
	// post an article
});

router.get('/:articleId', (req, res) => {
	// return article with given req.params.id 
});

router.put('/:articleId', (req, res) => {
	// update an article with given req.params.id 
});

router.delete('/:articleId', (req, res) => {
	// delete an article with given req.params.id 
});
// Comments
router.get('/:articleId/comments', (req, res) => {
	// return all coments for a given article
});

router.post('/:articleId/comments', (req, res) => {
	// post a comment on an article
});

router.get('/:articleId/comments/:commentId', (req, res) => {
	// return the comment from an article
});

router.put('/:articleId/comments/:commentId', (req, res) => {
	// update a comment on an article
});

router.delete('/:articleId/comments/:commentId', (req, res) => {
	// delete a comment on an article
});

module.exports = router;
