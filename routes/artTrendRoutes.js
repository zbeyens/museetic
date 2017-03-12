const artController = require('../app/controllers/artController'),
	userController = require('../app/controllers/userController'),
    async = require('async');

module.exports = (app, isLoggedIn) => {
    // const isProduction = process.env.NODE_ENV === 'production';

    //NOTE
    // if (!isProduction) {
    app.get('/populate', (req, res) => {
        artController.resetArts();
        res.redirect("/");
    });
    // }
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
};
