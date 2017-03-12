// const async = require('async');
const userController = require('../app/controllers/userController'),
	validator = require('validator');

module.exports = (app, isLoggedIn) => {
	app.get('/search', (req, res) => {
        let q = req.query.q;
		if (!q)
			return;
            console.log(q);
		q = encodeURIComponent(q);
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

        console.log(q);
		const searchUsers = userController.searchUsersByName(q);
		searchUsers.then((users) => {
			console.log(users);
			res.send(users);
		}).catch((err) => {
			console.log(err);
		});

		console.log(req.query);
	});
};
