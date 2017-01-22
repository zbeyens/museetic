var crypto = require('crypto'),
    StateController = require('./controllers/statecontroller'),
    Packet = require('./packet'),
    BufferReader = require('./shared/BufferReader'),
    lot = require('./shared/lot'),
    cfg = require('./shared/config');

/*jshint evil:true*/
/*Register socket events and emit.
Instanciate and start a server game.
*/

exports = module.exports = Server;

function Server(wss) {
    this.wss = wss;

    this.stateController = new StateController(function(socket, states) {
        this.sendMessage(socket, new Packet.Update(states));
    }.bind(this));

    this.lagCompensation = cfg.serverLagCompensation;

    this.handler = {
        1: this.onMsgSubmit.bind(this),
        // 1: this.onSpectate,
        10: this.onMsgInputLeft.bind(this),
        11: this.onMsgInputRight.bind(this),
        12: this.onMsgInputDash.bind(this),
        13: this.onMsgInputClick.bind(this),
    };
    this.handleSocketEvents();
}

Server.prototype = {
    //Events
    handleSocketEvents: function() {
        this.wss.on('connection', function(socket) {
            this.onPlayerConnect(socket);

            socket.on('message', function(msg) {
                this.handleMessage(socket, msg);
            }.bind(this));

            socket.on('close', function() {
                this.onPlayerDisconnect(socket);
            }.bind(this));
        }.bind(this));

        this.wss.on('error', function(e) {
            console.log("[Error] " + e.code);
            process.exit(1);
        });
    },

    handleMessage: function(socket, msg) {
        if (msg.length === 0) return;
        if (msg.length > 128) {
            console.log(socket.id + " kick");
            socket.close();
            return;
        }

        if (!this.handler.hasOwnProperty(msg[0])) return;

        this.handler[msg[0]](socket, msg);
    },

    sendMessage: function(socket, packet) {
        if (socket.readyState === 1) {
            var buf = packet.form();
            // console.log(buf);
            socket.send(buf, {
                binary: true
            });
        } else {
            socket.readyState = 3;
        }
    },

    onPlayerConnect: function(socket) {
        var origin = socket.upgradeReq.headers.origin;
        if (origin != 'http://' + cfg.serverUrl + ':' + cfg.serverPort &&
            origin != 'https://' + cfg.serverUrl + ':' + cfg.serverPort &&
            origin != 'http://localhost:' + cfg.serverPort &&
            origin != 'https://localhost:' + cfg.serverPort &&
            origin != 'http://127.0.0.1:' + cfg.serverPort &&
            origin != 'https://127.0.0.1:' + cfg.serverPort) {

            socket.close();
            return;
        }

        // var ip = socket._socket.remoteAddress + ":" + socket._socket.remotePort;
        // console.log(ip);

        if (this.stateController.getSockets().length >= cfg.serverMaxGamers) {
            socket.close();
            return;
        }

        var sameIp = 0;
        var sockets = this.stateController.getSockets();
        for (var i = sockets.length; i--;) {
            if (sockets[i].isConnected && sockets[i]._socket.remoteAddress == socket._socket.remoteAddress) {
                sameIp++;
            }
        }
        if (sameIp >= cfg.serverMaxSameIp) {
            socket.close();
            return;
        }

        var newSpectator = this.stateController.getTileController().getSpectatorController().add();
        socket.id = newSpectator.id;
        console.log('Spectator ' + socket.id + ' connected');
        socket.player = newSpectator;
        socket.isConnected = true;
        socket.isSpectator = true;
        this.stateController.addSocket(socket);
    },

    onMsgSubmit: function(socket, msg) {
        if (!socket.isSpectator) return;

        var buffer = new Uint8Array(msg).buffer;
        var buf = new BufferReader(buffer);
        buf.addOffset(1);
        var name = buf.getStringUTF8();
        if (name.length > 15) {
            name = name.substring(0, 14);
        }

        var tileController = this.stateController.getTileController();
        tileController.getSpectatorController().remove(socket.player);
        var newPlayer = tileController.getPlayerController().add(name);
        socket.id = newPlayer.id;
        socket.player = newPlayer;
        socket.isSpectator = false;

        console.log('Player ' + socket.id + ' connected');
        this.sendMessage(socket, new Packet.Submit(socket.id));
    },

    onMsgInputLeft: function(socket, msg) {
        if (msg.length !== 1 || socket.isSpectator) return;
        socket.player.setPressLeft(true);
        // setTimeout(function() {
        // }, this.lagCompensation);
    },

    onMsgInputRight: function(socket, msg) {
        if (msg.length !== 1 || socket.isSpectator) return;
        socket.player.setPressRight(true);
    },

    onMsgInputDash: function(socket, msg) {
        if (msg.length !== 1 || socket.isSpectator) return;
        socket.player.setPressDash(true);
    },
    onMsgInputClick: function(socket, msg) {
        if (msg.length !== 1 || socket.isSpectator) return;
        socket.player.setPressClick(true);
    },

    onPlayerDisconnect: function(socket) {
        socket.isConnected = false;
        if (socket.isSpectator) {
            this.stateController.getTileController().getSpectatorController().remove(socket.player);
            console.log('Spectator ' + socket.id + ' disconnected');
        } else {
            this.stateController.getTileController().getPlayerController().remove(socket.player);
            console.log('Player ' + socket.id + ' disconnected');
        }
        this.stateController.removeSocket(socket);

    },

    //Getters
    getStateController: function() {
        return this.stateController;
    },
};
