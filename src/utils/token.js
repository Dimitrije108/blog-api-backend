const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
	return jwt.sign(
		{ id: user.id, email: user.email, author: user.author },
		process.env.JWT_SECRET,
		{ expiresIn: '1h' }
	);
};

const generateRefreshToken = (user) => {
	return jwt.sign(
		{ id: user.id },
		process.env.JWT_REFRESH_SECRET,
		{ expiresIn: '7d' }
	);
};

module.exports = {
	generateAccessToken,
	generateRefreshToken
};
