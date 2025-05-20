const { Router } = require('express');
const router = Router();
const controller = require('../../controllers/auth');

// Register user
router.post('/register', controller.register);
// Login user
router.post('/login', controller.login);
// Refresh user access and refresh tokens
router.post('/refresh', controller.refreshToken);

module.exports = router;