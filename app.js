var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    flash = require('connect-flash'),
    logger = require('morgan'),
    http = require('http'),
    // https = require('https'),
    path = require('path'),
    fs = require('fs'),
    google = require('googleapis'),
    OAuth2 = google.auth.OAuth2,
    plus = google.plus('v1'),
    passport = require('passport'),
    mongoose = require('mongoose');

var cfgDb = require('./config/database.js'),
    cfgPassport = require('./config/passport.js'),
    routes = require('./routes.js');

cfgDb(mongoose);
cfgPassport(passport);

app.use(logger('dev'));
app.use('/client', express.static(path.join(__dirname, '/client')));
app.use(bodyParser.json()); //support json-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); //support url-encoded bodies
// app.use(cookieParser()); // read cookies (needed for auth)

app.use(session({
    secret: 'onepassword',
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    resave: true,
    saveUninitialized: true,
    cookie: {
        _expires: 500000
    }, // time im ms
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});
// app.use(express.favicon());

routes(app, passport);

/////////
// old //
/////////
// var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
var COMMENTS_FILE = path.join(__dirname, 'comments.json');
app.get('/api/comments', function(req, res) {
    fs.readFile(COMMENTS_FILE, function(err, data) {
        if (err) {
            process.exit(1);
        }
        res.json(JSON.parse(data));
    });
});

var success = function(err, login) {
    console.log(err + login);
};

app.post('/api/comments', function(req, res) {
    fs.readFile(COMMENTS_FILE, function(err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        var comments = JSON.parse(data);
        // NOTE: In a real implementation, we would likely rely on a database or
        // some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
        // treat Date.now() as unique-enough for our purposes.
        var newComment = {
            id: Date.now(),
            author: req.body.author,
            text: req.body.text,
        };
        comments.push(newComment);
        fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            res.json(comments);
        });
    });
});

var server = http.createServer(app);
server.listen(process.env.PORT || 8080, function() {
    console.log('Listening on http://localhost:' + (process.env.PORT || 8080));
});
