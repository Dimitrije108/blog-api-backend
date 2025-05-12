const { Router } = require('express');
const router = Router();
const controller = require('../../controllers/user');

// Get all users
router.get('/', controller.getAllUsers);
// Create user
router.post('/', controller.createUser);
// Get user
router.get('/:userId', controller.getUser);
// Update user
router.put('/:userId', controller.updateUser);
// Delete user
router.delete('/:userId', controller.deleteUser);
// Get all user articles
router.get('/:userId/articles', controller.getAllUserArticles);
// Get all user comments
router.get('/:userId/comments', controller.getAllUserComments);

module.exports = router;