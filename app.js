var express = require('express'),
    app = express(),
    server = require('http').createServer(),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        server: server,
        perMessageDeflate: false, //big headers to compress. Don't need
        // maxPayload: 4096
    }),
    path = require('path'),
    cfg = require('./shared/config'),
    Game = require('./game'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    helmet = require('helmet');

// var setCustomCacheControl = function(res, path) {
//     // remove when the app is stable
//     // console.log("oh " + express.static.mime.lookup(path));
//     if (express.static.mime.lookup(path) === 'text/html') {
//         // Custom Cache-Control for HTML files.
//         res.setHeader('Cache-Control', 'public, max-age=0');
//     }
// };

app.use(helmet());
app.use(logger('dev'));
app.use(favicon(__dirname + '/client/img/flappy0.png'));
app.use('/client', express.static(path.join(__dirname, '/client'), {
    maxAge: '1h',
    // setHeaders: setCustomCacheControl
}));
app.use('/shared', express.static(path.join(__dirname, '/shared'), {
    maxAge: '1h',
    // setHeaders: setCustomCacheControl
}));
// // Additional middleware which will set headers that we need on each request.
// app.use(function(req, res, next) {
//     //public to specify that the response is cacheable by clients and shared (proxy) caches.
//     //instructs the client to cache it for up to ... seconds
//     res.setHeader('Cache-Control', 'public, max-age=14400');
//     next();
// });

var isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
    //dev
    var webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackConfig = require('./webpack.config');

    var compiler = webpack(webpackConfig);
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
        heartbeat: 10 * 1000,
    }));
}

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

server.on('request', app); //or (app) in createServer
server.listen(cfg.serverPort, function() {
    console.log('Listening on port ' + cfg.serverPort);

    var game = new Game(wss);
    game.start();
});
