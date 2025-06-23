const { Router } = require('express');
const router = Router();
const controller = require('../../controllers/article');

// Articles
// Get all articles
router.get('/', controller.getAllArticles);
// Create article
router.post('/', controller.createArticle);
// Get all published articles
router.get('/published', controller.getAllPublishedArticles);
// Get article
router.get('/:articleId', controller.getArticle);
// Update article
router.put('/:articleId', controller.updateArticle);
// Update article publish status
router.patch('/:articleId', controller.updatePublishStatus);
// Delete article
router.delete('/:articleId', controller.deleteArticle);
// Comments
// Get all article comments
router.get('/:articleId/comments', controller.getAllComments);
// Create article comment
router.post('/:articleId/comments', controller.createComment);
// Get article comment
router.get('/:articleId/comments/:commentId', controller.getComment);
// Update article comment
router.put('/:articleId/comments/:commentId', controller.updateComment);
// Delete article comment
router.delete('/:articleId/comments/:commentId', controller.deleteComment);

module.exports = router;
