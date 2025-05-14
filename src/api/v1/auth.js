const { Router } = require('express');
const router = Router();
const controller = require('../../controllers/auth');

// Register user
router.post('/register', controller.register);
// Login user
router.post('/login', controller.login);
// Refresh user access token
router.post('/refresh-token', controller.refreshToken);
// Logout user
router.post('/logout', controller.logout);

module.exports = router;