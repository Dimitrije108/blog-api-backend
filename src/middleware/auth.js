const passport = require('passport');
// Authenticate user via JWT's access token
const authUser = passport.authenticate('jwt', { session: false });

const authAuthor = (req, res, next) => {
	if (req.user?.author) {
		return next();
	}
	return res.status(403).json({ message: "Forbiden access: Authors only"});
};

const optionalAuth = (req, res, next) => {
	passport.authenticate("jwt", { session: false }, (err, user) => {
		if (user) {
			req.user = user;
		};
		next();
	})(req, res, next);
};

module.exports = {
	authUser,
	authAuthor,
	optionalAuth,
};
