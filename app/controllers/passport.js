var FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy = require('passport-local').Strategy,
    validator = require('validator'),
    User = require('../models/users'),
    cfgAuth = require('../../config/auth');

/**
 * we will use Session-based authentication
 * session.id is equivalent to a token (with expires)
 * associated to one user.id.
 * Disadvantage: memory usage.
 *
 * >< Token-based authentication:
 * no session, a token is attached to every request (can be stored in a cookie)
 */
module.exports = function(passport) {
    /**
     * serialize the user for the session giving user.id
     * then we can recover the user later
     * OPTI: can store more than the id in the session if it needs multiple API calls.
     */
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    /**
     * all subreq have session.id cookie - get user.id.
     * from this, we recover the user from the database.
     * then we put req.user (authentication) for every subreq.
     */
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //Facebook.
    passport.use(new FacebookStrategy({
            // pull in our app id and secret from our auth.js file
            clientID: cfgAuth.facebookAuth.clientID,
            clientSecret: cfgAuth.facebookAuth.clientSecret,
            callbackURL: cfgAuth.facebookAuth.callbackURL,
            profileFields: ['id', 'name', 'displayName', 'photos', 'emails', 'gender'],
        },
        //verify callback: facebook will send back the token and profile
        //Once an access token is no longer valid,
        //we need to create a new one by using the refresh token.
        //send: user
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
                        //if no email
                        if (user.facebook.email === undefined) {
                            //if the user finally accepts to give email
                            if (profile.emails) {
                                user.facebook.email = profile.emails[0].value;
                                user.save(function(err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }
                        }

                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser = new User();

                        // set all of the facebook information in our user model
                        newUser.facebook.id = profile.id; // set the users facebook id
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned

                        newUser.facebook.picture = profile.photos[0].value;
                        //the user can refuse
                        if (profile.emails) {
                            newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                            console.log(newUser.facebook.email);
                        }

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));


    //Local signup
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            if (!validator.isEmail(email)) {
                console.log("Email invalide");
                return done(null, false, {
                    email: 'Email invalide'
                });
            }

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {
                // check existence of mail
                User.findOne({
                    'local.email': email
                }, function(err, user) {
                    // if there are any errors, return the error
                    if (err) return done(err);

                    if (user) {
                        console.log("Email déjà utilisée");
                        return done(null, false, {
                            email: 'Email déjà utilisée'
                        });
                    } else {
                        // create the user
                        var newUser = new User();

                        newUser.local.name = req.body.name;
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);

                        // save the user
                        newUser.save(function(err) {
                            if (err) throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {

            if (!validator.isEmail(email)) {
                console.log("Email invalide");
                return done(null, false, {
                    global: 'Invalide'
                });
            }

            User.findOne({
                'local.email': email
            }, function(err, user) {
                if (err) return done(err);

                // if no user is found, return the message
                if (!user) {
                    console.log("Email invalide");
                    return done(null, false, {
                        email: "L'email que vous avez entré ne correspond à aucun compte."
                    });
                }

                // if the user is found but the password is wrong
                if (!user.validPassword(password)) {
                    console.log("Le mot de passe que vous avez entré est incorrect.");
                    return done(null, false, {
                        password: "Le mot de passe que vous avez entré est incorrect."
                    });
                }

                return done(null, user);
            });

        }
    ));
};
