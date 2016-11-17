var FacebookStrategy = require('passport-facebook').Strategy,
    User = require('../app/models/users'),
    cfgAuth = require('./auth');

module.exports = function(passport) {

    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    // when done(null, user), the user id will be stored in a cookie: req.user.id
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user: req.user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
            // pull in our app id and secret from our auth.js file
            clientID: cfgAuth.facebookAuth.clientID,
            clientSecret: cfgAuth.facebookAuth.clientSecret,
            callbackURL: cfgAuth.facebookAuth.callbackURL,
            profileFields: ['id', 'name', 'displayName', 'photos', 'emails', 'gender'],
        },
        //verify callback: facebook will send back the token and profile
        function(token, refreshToken, profile, done) {
            // asynchronous
            process.nextTick(function() {
                // find the user in the database based on their facebook id
                User.findOne({
                    'facebook.id': profile.id
                }, function(err, user) {
                    // if the user is found, then log them in
                    if (user) {
                        console.log(user);
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser = new User();

                        // set all of the facebook information in our user model
                        newUser.facebook.id = profile.id; // set the users facebook id
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                        newUser.facebook.picture = profile.photos[0].value;

                        // save our user to the database
                        newUser.save(function(err) {
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));
};
