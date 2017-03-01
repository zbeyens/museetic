const artController = require('./app/controllers/artController'),
	userController = require('./app/controllers/userController'),
	path = require('path'),
	async = require('async');

function isLoggedOut(req, res, next) {
	// if user is authenticated (req.user) in the session, carry on
	if (req.isAuthenticated()) {
		return res.sendStatus(403);
	}

	return next();
}

function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (!req.isAuthenticated()) {
		return res.sendStatus(403);
	}

	return next();
}

/**
* get userInfo to send
* @param  {Object} user from db
* @return {Object}      userInfo to send
*/
const getUserInfo = function(user) {
	const userInfo = {};
	userInfo.email = user.local.email;
	userInfo.name = user.local.name;
	return userInfo;
};

function successRedirectSocial(req, res) {
	res.send('<html><head><script type="text/javascript">window.close();</script></head></html>');
}

module.exports = function(app, passport) {
	// const isProduction = process.env.NODE_ENV === 'production';

	//NOTE
	// if (!isProduction) {
	app.get('/populate', (req, res) => {
		artController.resetArts();
		res.redirect("/");
	});
	// }

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

	//Local
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

	//req.login automatically invoked with passport.authenticate.
	app.post('/login', isLoggedOut, (req, res, next) => {
		passport.authenticate('local-login', (err, user, info) => {
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

	app.post('/logout', isLoggedIn, (req, res) => {
		console.log('Disconnected');
		req.logout(); //req.user=null.
		req.session.destroy();
		res.sendStatus(200);
	});

	app.get('/arttrend', isLoggedIn, (req, res) => {
		async.waterfall([
			//findArtCurrent from req.user
			(cb) => {
				const findArtCurrent = userController.findArtCurrent(req.user);
				findArtCurrent.then((user) => {
					cb(null, user.arts);
				}).catch((err) => {
					cb(err);
				});
			}, //countArts to pick randomly one art
			(userArts, cb) => {
				const countArts = artController.count();
				countArts.then((count) => {
					cb(null, count, userArts); //
				}).catch((err) => {
					cb(err);
				});
			}, //findNextArts (random)
			(countArts, userArts, cb) => {
				const findNextArt = artController.findNextArt(countArts, userArts.current);
				findNextArt.then((nextArt) => {
					cb(null, nextArt);
				}).catch((err) => {
					cb(err);
				});
			}, //updateArtCurrent from req.user
			(nextArt, cb) => {
				const updateArtCurrent = userController.updateArtCurrent(req.user._id, nextArt._id);
				updateArtCurrent.then((user) => {
					res.send(nextArt);
					cb(null, 'done');
				}).catch((err) => {
					cb(err);
				});
			}
		], (err, results) => {
			console.log(err);
		});
		console.log("sending artTrend");
	});

	//user current=1? find art=2, set user current=2

	// app.get('/skipArt', isLoggedIn, (req, res) => {
	//     const user = req.user;
	//     console.log(user.arts.current);
	//     // if (!user.arts.current) {
	//     //     userController.
	//     // }
	// 	console.log("sending artTrend");
	// 	artController.findArtTrend((art) => {
	// 		console.log(art);
	// 		res.send(art);
	// 	});
	// });

	//Main - after all our routing
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '/index.html'));
	});
};
