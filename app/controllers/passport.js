const FacebookStrategy = require('passport-facebook').Strategy,
	LocalStrategy = require('passport-local').Strategy,
	validator = require('validator'),
	User = require('../models/user'),
	cfgAuth = require('../../config/auth'),
	cfg = require('../../config/configServer'),
    cfgShared = require('../../shared/config');

/**
 * we will use Session-based authentication
 * session.id is equivalent to a token (with expires)
 * associated to one user.id.
 * Disadvantage: memory usage.
 *
 * >< Token-based authentication:
 * no session, a token is attached to every request (can be stored in a cookie)
 */
module.exports = function(passport) {
	/**
     * serialize the user for the session giving user.id
     * then we can recover the user later
     * OPTI: can store more than the id in the session if it needs multiple API calls.
     */
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	/**
     * all subreq have session.id cookie - get user.id.
     * from this, we recover the user from the database.
     * then we put req.user (authentication) for every subreq.
     */
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});

	//Local signup
	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true // allows us to pass back the entire request to the callback
	}, (req, email, password, done) => {
		if (!validator.isEmail(email)) {
			return done(null, false, {email: cfg.mailErrorInvalide});
		}

		// asynchronous
		// User.findOne wont fire unless data is sent back
		process.nextTick(() => {
			// check existence of mail
			User.findOne({
				email: email
			}, (err, user) => {
				// if there are any errors, return the error
				if (err)
					return done(err);

				if (user) {
					return done(null, false, {email: cfg.mailErrorUsed});
				}
				if (email.length > cfg.formEmailLength) {
					return done(null, false, {email: cfg.mailErrorLength});
				} else if (req.body.name.length > cfg.formNameLength) {
					return done(null, false, {name: cfg.nameErrorLength});
				}
				// create the user
				const newUser = new User();

				newUser.name = req.body.name;
                newUser.picture = cfgShared.defaultPicUser;
				newUser.email = email;
				newUser.local.password = newUser.generateHash(password);

                if (email === cfg.adminMail) {
                    newUser.role = "admin";
                }

				// save the user
				newUser.save((e) => {
					if (e)
						throw e;
					return done(null, newUser);
				});
			});
		});
	}));

    //same for authenticating
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, (req, email, password, done) => {
		if (!validator.isEmail(email)) {
			return done(null, false, {global: 'Invalide'});
		}

		User.findOne({
			email: email
		}, (err, user) => {
			if (err)
				return done(err);

			// if no user is found, return the message
			if (!user) {
				return done(null, false, {email: cfg.authMailErrorInvalide});
			}

			// if the user is found but the password is wrong
			if (!user.validPassword(password)) {
				return done(null, false, {password: cfg.authPasswordErrorInvalide});
			}

			return done(null, user);
		});
	}));

	//Facebook. Not used
	passport.use(new FacebookStrategy({
		// pull in our app id and secret from our auth.js file
		clientID: cfgAuth.facebookAuth.clientID,
		clientSecret: cfgAuth.facebookAuth.clientSecret,
		callbackURL: cfgAuth.facebookAuth.callbackURL,
		profileFields: [
			'id',
			'name',
			'displayName',
			'photos',
			'emails',
			'gender'
		]
	},
	//verify callback: facebook will send back the token and profile
	//Once an access token is no longer valid,
	//we need to create a new one by using the refresh token.
	//send: user
	(token, refreshToken, profile, done) => {
		// asynchronous
		process.nextTick(() => {
			// find the user in the database based on their facebook id
			User.findOne({
				'facebook.id': profile.id
			}, (err, user) => {
				// if the user is found, then log them in
				if (user) {
					console.log(user);
					//if no email
					if (user.facebook.email === undefined) {
						//if the user finally accepts to give email
						if (profile.emails) {
							user.facebook.email = profile.emails[0].value;
							user.save((e) => {
								if (e)
									throw e;
								return done(null, user);
							});
						}
					}

					return done(null, user); // user found, return that user
				}
				// if there is no user found with that facebook id, create them
				const newUser = new User();

				// set all of the facebook information in our user model
				newUser.facebook.id = profile.id; // set the users facebook id
				newUser.facebook.token = token; // we will save the token that facebook provides to the user
				newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned

				newUser.facebook.picture = profile.photos[0].value;
				//the user can refuse
				if (profile.emails) {
					newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
					console.log(newUser.facebook.email);
				}

				// save our user to the database
				newUser.save((e) => {
					if (e)
						throw e;
					return done(null, newUser);
				});
			});
		});
	}));
};
