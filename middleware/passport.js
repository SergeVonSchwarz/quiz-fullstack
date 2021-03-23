const keys = require("../config/keys");
const User = require('../models/User')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = keys.jwt

module.exports = passport => {
	passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
		try {
			const user = await User.findById(jwt_payload.userId).select('email id')
			if (user) {
				return done(null, user)
			} else {
				return done(null, false)
			}
		} catch(err) {
			console.log('Passwort error: ', err)
		}

	}))
}

