module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        console.log(__dirname + '/index.html');
        res.sendFile(__dirname + '/index.html');
    });

    // app.post('/login', do all our passport stuff here);

    app.get('/profile', isLoggedIn, function(req, res) {
        console.log("logged in");
        console.log(req.user);
    });

    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email'],
    }));
    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/',
    }), successRedirect);

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/api', function(req, res) {
        var idToken = req.body.id_token;
        var aud = "119719318456-ohdb4e11na4ohkggtgs91rtmibk2d4c9";
        // auth.verifyIdToken(idToken, aud, success);
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}

function successRedirect(req, res) {
    res.send('<html><head><script type="text/javascript">window.close();</script></head></html>');
}
