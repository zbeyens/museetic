function isLoggedOut(req, res, next) {
	// if user is authenticated (req.user) in the session, carry on
	if (req.isAuthenticated()) {
		return res.sendStatus(403);
	}

	return next();
}

/**
* get userInfo to send
* @param  {Object} user from db
* @return {Object}      userInfo to send
*/
const getUserInfo = (user) => {
	const userInfo = {};
	userInfo.email = user.email;
	userInfo.name = user.name;
	return userInfo;
};

function successRedirectSocial(req, res) {
	res.send('<html><head><script type="text/javascript">window.close();</script></head></html>');
}

module.exports = (app, passport, isLoggedIn) => {
	//Facebook
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

	//load auth datas
	app.get('/loadAuth', (req, res, next) => {
		console.log("load:");
		if (req.isAuthenticated()) {
			return res.send(getUserInfo(req.user));
		} else {
			return res.send(false);
		}
	});

	//headers: cookie: 'PHPSESSID=k1rhunhmmp0kdoiaha3gjc4gi0; connect.sid=s%3AVYdD_qIvhfNsLxYdWcdL1z4VFSmG4iNR.MgLRp27o7YsxQwNq3a%2BW98r96gLvFdmmbDfDL0IPT1M' }
	//sessionID: 'VYdD_qIvhfNsLxYdWcdL1z4VFSmG4iNR',

	//Local signup
	app.post('/signup', isLoggedOut, (req, res, next) => {
		passport.authenticate('local-signup', (err, user, info) => {
			console.log(info);
			console.log(req.session);
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
	app.post('/login', isLoggedOut, (req, res, next) => {
		passport.authenticate('local-login', (err, user, info) => {
            console.log(info);
			if (err)
				return res.sendStatus(500);

			//invalid logs
			if (!user) {
				return res.status(400).send(info);
			}
			console.log("login!");
			//req.user is put.
			req.login(user, (e) => {
				if (e)
					return res.sendStatus(500);
				return res.send(getUserInfo(user));
				// return next();
			});
		})(req, res, next);
	});

    //Logout
	app.post('/logout', isLoggedIn, (req, res) => {
		console.log('Disconnected');
		req.logout(); //req.user=null.
		req.session.destroy();
		res.sendStatus(200);
	});
};
