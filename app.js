const express = require('express'),
	session = require('express-session'),
	app = express(),
	bodyParser = require('body-parser'),
	// cookieParser = require('cookie-parser'), //not needed with passport
	MongoStore = require('connect-mongo')(session),
	logger = require('morgan'),
	http = require('http'),
	// httpProxy = require('http-proxy'), https = require('https'),
	path = require('path'),
	// fs = require('fs'),
	favicon = require('serve-favicon'),
	// chalk = require('chalk'), multer = require('multer'), //upload pic
	// server-side
	passport = require('passport'),
	mongoose = require('mongoose');

const cfgDb = require('./config/database.js'),
	cfgPassport = require('./app/controllers/passport.js'),
	routes = require('./routes/routes.js');
const isProduction = process.env.NODE_ENV === 'production';

cfgDb(mongoose);
cfgPassport(passport);
//all client static files served before session.
app.use('/client', express.static(path.join(__dirname, '/client'), {maxAge: '1h'}));
app.use(favicon(path.join(__dirname, '/client/img/museum.png')));
app.use(logger('dev'));
app.use(bodyParser.json()); //support json-encoded bodies
app.use(bodyParser.urlencoded({extended: true})); //support url-encoded bodies
// app.use(cookieParser()); // read cookies (needed for auth) take a pic and put
// it in uploads. app.use(multer({     dest: path.join(__dirname,
// '/client/img/uploads'),     rename: function(fieldname, filename) { return
// filename;     }, })); app.post(‘/api/photo’,function(req,res){  var newItem =
// new Item();  newItem.img.data = fs.readFileSync(req.files.userPhoto.path)
// newItem.img.contentType = ‘image/png’;  newItem.save(); });

app.use((req, res, next) => {
	// console.log(req);
	next();
});

/**
 * !!! the cookie is session.id (signed with the secret)
 * req.session =
 * {id, cookie: {originalMaxAge:500000, expires:date, httpOnly:true, path:"/"},
 * passport: {user: id}}
 * (passport only if connected, so offline user have )
 * httpOnly means that the client can not read with document.cookie (avoid attacks)
 *
 * A cookie is sent to the client with Set-Cookie header to res.
 * session.save() called at the end of res if session has been modified.
 * It saves/updates the session in the store.
 * Client sends it for every subreq to auth: req.headers.cookie.
 * As the client can clear his cookies, the session should has a expire time
 * to avoid memory leakage.
 */
app.use(session({
	//secure: true //if https
	secret: 'onepassword', //to sign the cookie
	store: new MongoStore({mongooseConnection: mongoose.connection}),
	resave: true, //i.e. update maxAge at each subseq req.
	saveUninitialized: false, //no session for visitor.
	rolling: true, //Force the session (if any) cookie to be set on every response (reset expiration timeout).
	cookie: { //settings of the cookie to send.
		maxAge: 3600000 * 24 * 90 //3 months
	}
}));
// if ( req.body.remember ) {     var hour = 3600000; req.session.cookie.maxAge
// = 14 * 24 * hour; //2 weeks } else { req.session.cookie.expires = false; }
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Additional middleware which will set headers that we need on each request.
app.use((req, res, next) => {
	// Disable caching so we'll always get the latest comments.
	res.setHeader('Cache-Control', 'no-cache');
	next();
});

if (!isProduction) {
	//dev
	const webpack = require('webpack'),
		webpackDevMiddleware = require('webpack-dev-middleware'),
		webpackHotMiddleware = require('webpack-hot-middleware'),
		webpackConfig = require('./webpack.config');

	const compiler = webpack(webpackConfig);
	app.use(webpackDevMiddleware(compiler, {
		hot: true,
		noInfo: true,
		filename: webpackConfig.output.filename,
		publicPath: webpackConfig.output.publicPath,
		stats: {
			colors: true
		}
	}));
	app.use(webpackHotMiddleware(compiler, {
		log: console.log,
		path: '/__webpack_hmr',
		heartbeat: 10 * 1000
	}));
}

routes(app, passport);

// /////// old // /////// var oauth2Client = new OAuth2(CLIENT_ID,
// CLIENT_SECRET, REDIRECT_URL); var COMMENTS_FILE = path.join(__dirname,
// 'comments.json'); app.get('/api/comments', function(req, res) {
// fs.readFile(COMMENTS_FILE, function(err, data) {         if (err) {
//   process.exit(1); }         res.json(JSON.parse(data));     }); });
//
// var success = function(err, login) {     console.log(err + login); };
// app.post('/api/comments', function(req, res) {     fs.readFile(COMMENTS_FILE,
// function(err, data) {         if (err) {             console.error(err);
//   process.exit(1);         }         var comments = JSON.parse(data);      //
// NOTE: In a real implementation, we would likely rely on a database or
// // some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
//     // treat Date.now() as unique-enough for our purposes.    var newComment
// = {             id: Date.now(),             author: req.body.author,
//    text: req.body.text,         }; comments.push(newComment);
// fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err)
// {             if (err) {             console.error(err);
// process.exit(1); }             res.json(comments);         });     }); });

const server = http.createServer(app);
server.listen(process.env.PORT || 5000, () => {
	console.log('Listening on http://localhost:' + (process.env.PORT || 5000));
});
