// const async = require('async');
const userController = require('../app/controllers/userController'),
    artController = require('../app/controllers/artController'),
	validator = require('validator'),
    async = require('async');

module.exports = (app, isLoggedIn) => {
    //send [] suggestions
	app.get('/suggestions', isLoggedIn, (req, res) => {
        let q = req.query.q;
		if (!q)
			return;
            console.log(q);

		q = decodeURIComponent(q);
		const valideLength = validator.isLength(q, {
			min: 1,
			max: 30
		});
		if (!valideLength) {
			res.sendStatus(400);
			return;
		}
        q = validator.trim(q);

		const searchUsers = userController.searchUsersByName(q);
		searchUsers.then((users) => {
			console.log(users);
			res.send(users);
		}).catch((err) => {
            res.sendStatus(400);
			console.log(err);
		});
	});

    //send 1 user
    app.get('/search', isLoggedIn, (req, res) => {
        let q = req.query.q;
        q = decodeURIComponent(q);
        console.log(q);
        async.waterfall([
            //findArtCurrent from req.user
            (cb) => {
                const findUserById = userController.findUserById(q);
                findUserById.then((user) => {
                    cb(null, user);
        		}).catch((err) => {
                    cb(err);
        		});
            },
            (user, cb) => {
                const findByLikes = artController.findByLikes(user._id);
                findByLikes.then((arts) => {
                    res.send({
                        user,
                        arts
                    });
                    cb(null, 'done');
        		}).catch((err) => {
                    cb(err);
        		});
            }
        ], (err, results) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });
    });
};
