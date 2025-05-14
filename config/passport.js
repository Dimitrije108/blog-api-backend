const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Local strategy for login
passport.use(
	'local',
	new LocalStrategy(
		{ usernameField: 'email' },
		async (email, password, done) => {
			try {
				// Find user
				const user = await prisma.user.findUnique({
					where: {
						email: email,
					}
				});
				// Check if user exists
				if (!user) {
					return done(null, false, { message: "Incorrect username" });
				}
				// Check user password
				const match = await bcrypt.compare(password, user.password);
				if (!match) {
					return done(null, false, { message: "Incorrect password" });
				}
				return done(null, user);
			} catch(err) {
				return done(err);
			}
		}
	)
);

// JWT strategy for authorization
passport.use(
	'jwt',
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
		},
		async (payload, done) => {
			try {
				const user = await prisma.user.findUnique({
					where: {
						id: payload.id
					}
				})
				
				if (user) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			} catch (err) {
				return done(err, false);
			}
		}
	)
);
