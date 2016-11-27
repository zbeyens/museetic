module.exports = function(app, passport) {

    //Facebook
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email'],
    }));
    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/',
    }), successRedirectSocial);

    //Local
    app.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json({
                    message: info.message
                });
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return next();
            });
        })(req, res, next);
    }, isLoggedIn);

    app.post('/login', passport.authenticate('local-login', {
        // successRedirect: '/profile', // redirect to the secure profile section
        // failureRedirect: '/login', // redirect back to the signup page if there is an error
    }));
    app.post('/logout', function(req, res) {
        console.log('salut');
        req.logout();
        res.end();
    });


    app.get('/login', isLoggedIn, function(req, res) {
        console.log("logged in");
        console.log(req.user);
    });

    //Main - after all our routing
    app.get('*', function(req, res) {
        res.sendFile(__dirname + '/index.html');
        //can we res.json here ?
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        res.json({
            loggedIn: true
        });
    } else {
        res.json({
            loggedIn: false
        });
    }

    return next();
    // if they aren't redirect them to the home page
    // res.redirect('/');
}

// function successRedirectLocal(req, res) {
//     console.log(req.error);
//     console.log('...');
// }

function successRedirectSocial(req, res) {
    res.send('<html><head><script type="text/javascript">window.close();</script></head></html>');
}
