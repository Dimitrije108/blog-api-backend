const { Router } = require('express');
const router = Router();
// TODO: add authentication and authorization 
router.get('/', (req, res) => {
	// return all users
});

router.post('/', (req, res) => {
	// create user
});

router.get('/:userId', (req, res) => {
	// return user
});

router.put('/:userId', (req, res) => {
	// update user
});

router.delete('/:userId', (req, res) => {
	// delete user
});

router.get('/:userId/articles', (req, res) => {
	// return all user articles
	// maybe check if they are author and then have a custom response
});

router.get('/:userId/comments', (req, res) => {
	// return all user comments
});

module.exports = router;