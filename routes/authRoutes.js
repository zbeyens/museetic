/**
 * middleware checking if the user is logged out
 * @param  {Object}   req
 * @param  {Object}   res
 * @param  {Function} next
 * @return {res|next}
 */
function isLoggedOut(req, res, next) {
	// if user is authenticated (req.user) in the session, carry on
	if (req.isAuthenticated()) {
		return res.sendStatus(403);
	}

	return next();
}

/**
* get userInfo to send at every request
* @param  {Object} user from db
* @return {Object}      userInfo to send
*/
const getUserInfo = (user) => {
	const userInfo = {};
    userInfo._id = user._id;
    userInfo.role = user.role;
	userInfo.email = user.email;
	userInfo.name = user.name;
	userInfo.bio = user.bio;
	userInfo.picture = user.picture;
	userInfo.location = user.location;
	userInfo.profession = user.profession;
	userInfo.gender = user.gender;
	userInfo.friends = user.friends;
	userInfo.friendRequests = user.friendRequests;
	return userInfo;
};

/**
 * not used, it would be for facebook connexion
 */
function successRedirectSocial(req, res) {
	res.send('<html><head><script type="text/javascript">window.close();</script></head></html>');
}

module.exports = (app, passport, isLoggedIn) => {
    //headers: cookie: 'PHPSESSID=k1rhunhmmp0kdoiaha3gjc4gi0; connect.sid=s%3AVYdD_qIvhfNsLxYdWcdL1z4VFSmG4iNR.MgLRp27o7YsxQwNq3a%2BW98r96gLvFdmmbDfDL0IPT1M' }
	//sessionID: 'VYdD_qIvhfNsLxYdWcdL1z4VFSmG4iNR',
	//Facebook authentication, not used
	app.get('/auth/facebook', passport.authenticate('facebook', {
		scope: ['email'],
		authType: 'rerequest',
		display: 'popup'
	}));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		// successRedirectSocial: '/auth/facebook/success',
		failureRedirect: '/'
	}), successRedirectSocial, isLoggedIn);

	//load auth datas when user does not have them. Send nothing if not logged in
	app.get('/loadAuth', (req, res, next) => {
		if (req.isAuthenticated()) {
			return res.send(getUserInfo(req.user));
		} else {
			return res.send(false);
		}
	});


	//if logged out, local signup. Send error message if not valide
    //if valide, login after signup
	app.post('/signup', isLoggedOut, (req, res, next) => {
		passport.authenticate('local-signup', (err, user, info) => {
			if (err)
				return res.sendStatus(500);

			//invalid logs
			if (!user) {
				return res.status(400).send(info);
			}
			//req.user is put.
			req.login(user, (e) => {
				if (e)
					return res.sendStatus(500);
				return res.send(getUserInfo(user));
				// return next();
			});
		})(req, res, next);
	});

    //Local login
	//req.login automatically invoked with passport.authenticate.
    //send error msg if not valide
	app.post('/login', isLoggedOut, (req, res, next) => {
		passport.authenticate('local-login', (err, user, info) => {
			if (err)
				return res.sendStatus(500);

			//invalid logs
			if (!user) {
				return res.status(400).send(info);
			}
			//req.user is put.
			req.login(user, (e) => {
				if (e)
					return res.sendStatus(500);
				return res.send(getUserInfo(user));
				// return next();
			});
		})(req, res, next);
	});

    //if logged in, logout: destroy the session.
	app.post('/logout', isLoggedIn, (req, res) => {
		console.log('Disconnected');
		req.logout(); //req.user=null.
		req.session.destroy();

        res.sendStatus(200);
	});
};
