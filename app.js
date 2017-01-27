var express = require('express'),
    app = express(),
    server = require('http').createServer(),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        server: server,
        // perMessageDeflate: false,
        // maxPayload: 4096
    }),
    path = require('path'),
    cfg = require('./shared/config'),
    Game = require('./game'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    helmet = require('helmet');


app.use(helmet());
app.use(logger('dev'));
app.use(favicon(__dirname + '/client/img/flappyR0.png'));
app.use('/client', express.static(path.join(__dirname, '/client')));
app.use('/shared', express.static(path.join(__dirname, '/shared')));

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
