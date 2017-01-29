var Packet = require('./packet'),
    BufferReader = require('./../shared/BufferReader'),
    cfg = require('./../shared/config');

exports = module.exports = Receiver;

function Receiver() {
    this.handler = {
        1: this.onMsgSubmit.bind(this),
        2: this.onMsgClear.bind(this),
        // 1: this.onSpectate,
        10: this.onMsgInputLeft.bind(this),
        11: this.onMsgInputRight.bind(this),
        12: this.onMsgInputDash.bind(this),
        13: this.onMsgInputClick.bind(this),
    };
    this.handleSocketEvents();

    this.lagCompensation = cfg.serverLagCompensation;
}

Receiver.prototype = {
    /**
     * Events: connection, msg, close, errorok
     * @return {void}
     */
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


    /**
     * kick if hacked msg
     * @param  {socket} socket
     * @param  {Buffer} msg
     * @return {void}
     */
    handleMessage: function(socket, msg) {
        if (msg.length === 0) return;
        if (msg.length > cfg.serverPacketMaxSize) {
            console.log(socket.id + " kick");
            socket.close();
            return;
        }

        if (!this.handler.hasOwnProperty(msg[0])) return;

        this.handler[msg[0]](socket, msg);
    },

    /**
     * reset the socket so we no longer send updates
     * @param  {socket} socket
     * @return {void}
     */
    onMsgClear: function(socket) {
        // if (socket.clearedSpectator) return;
        // socket.clearedPlayer
        // socket.clearing = true;
        this.sendMessage(socket, new Packet.Clear());
    },

    /**
     * after Clearing, Submit.
     * if spectator:
     * check username length
     * remove spectator and add player
     *
     * socket.id = player.id
     * socket.player = player
     * send Packet.Submit(id)
     * @param  {socket} socket
     * @param  {Buffer} msg
     * @return {void}
     */
    onMsgSubmit: function(socket, msg) {
        if (socket.id != -1) return;

        var buffer = new Uint8Array(msg).buffer;
        var buf = new BufferReader(buffer);
        buf.addOffset(1);
        var name = buf.getStringUTF8();
        if (name.length > cfg.playerNameMaxSize) {
            name = name.substring(0, cfg.playerNameMaxSize - 1);
        }

        var tileController = this.stateController.getTileController();
        tileController.getPlayerController().addInGame(socket.player, name);
        socket.clearing = false;
        socket.id = socket.player.id;
        console.log('Player ' + socket.id + ' connected');
        this.sendMessage(socket, new Packet.Clear());
        this.sendMessage(socket, new Packet.Submit(socket.id));
    },

    onMsgInputLeft: function(socket, msg) {
        if (msg.length !== 1 || socket.id == -1) return;
        socket.player.setPressLeft(true);
        // setTimeout(function() {
        // }, this.lagCompensation);
    },

    onMsgInputRight: function(socket, msg) {
        if (msg.length !== 1 || socket.id == -1) return;
        socket.player.setPressRight(true);
    },

    onMsgInputDash: function(socket, msg) {
        if (msg.length !== 1 || socket.id == -1) return;
        socket.player.setPressDash(true);
    },
    onMsgInputClick: function(socket, msg) {
        if (msg.length !== 1 || socket.id == -1) return;
        socket.player.setPressClick(true);
    },
};
