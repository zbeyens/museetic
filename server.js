var StateController = require('./controllers/statecontroller'),
    _ = require('underscore'),
    cfg = require('./shared/config'),
    Packet = require('./socket/packet'),
    Receiver = require('./socket/receiver'),
    Sender = require('./socket/sender');

exports = module.exports = Server;

/**
 * Register socket events and emit
 * Instanciate and start a server game
 * Handle connect and disconnect players
 * @param {websocket} wss
 */
function Server(wss) {
    this.wss = wss;

    this.stateController = new StateController(function(socket, states) {
        this.sendMessage(socket, new Packet.Update(states));
    }.bind(this));

    Receiver.call(this);
}

Server.prototype = _.extend(Object.create(Receiver.prototype), Object.create(Sender.prototype), {
    /**
     * check origin of socket
     * check maxGamers
     * check maxSameIp
     * if ok, add spectator
     *
     * socket.id: spectator.id
     * socket.isConnected: true
     * socket.isSpectator: true
     * add to sockets
     * @param  {socket} socket
     * @return {void}
     */
    onPlayerConnect: function(socket) {
        var origin = socket.upgradeReq.headers.origin;
        console.log(origin);
        if (origin != 'http://' + cfg.serverUrl &&
            origin != 'https://' + cfg.serverUrl &&
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

    /**
     * socket.isConnected: false
     * remove gamer
     * remove socket
     * @param  {socket} socket
     * @return {void}
     */
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
});
