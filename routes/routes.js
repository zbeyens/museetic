const path = require('path'),
    authRoutes = require('./authRoutes'),
    userRoutes = require('./userRoutes'),
    artRoutes = require('./artRoutes');

function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (!req.isAuthenticated()) {
		return res.sendStatus(403);
	}

	return next();
}

module.exports = (app, passport) => {
    authRoutes(app, passport, isLoggedIn);
    artRoutes(app, isLoggedIn);
    userRoutes(app, isLoggedIn);

	//Main - after all our routing
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../index.html'));
	});
};
