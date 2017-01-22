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
    logger = require('morgan'),
    helmet = require('helmet');

app.use(helmet());
app.use(logger('dev'));
app.use('/client', express.static(path.join(__dirname, '/client')));
app.use('/shared', express.static(path.join(__dirname, '/shared')));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});


server.on('request', app); //or (app) in createServer
server.listen(cfg.serverPort, function() {
    console.log('Listening on port ' + cfg.serverPort);

    var game = new Game(wss);
    game.start();
});
