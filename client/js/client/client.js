var Debug = require('./others/debug'),
    Chat = require('./others/chat'),
    cfg = require('../../../shared/config'),
    Sender = require('./socket/sender'),
    Receiver = require('./socket/receiver'),
    StateController = require('./controllers/statecontroller');

exports = module.exports = Client;

function Client(socket) {
    if (cfg.debug) {
        new Chat(socket);
    }

    this.socket = socket;
    this.stateController = new StateController();

    this.selfId = -1;
    this.leftSpectator = false;

    Receiver.call(this);
    Sender.call(this);
}


Client.prototype = _.extend(Object.create(Sender.prototype), Object.create(Receiver.prototype), {
    onDisconnect: function() {
        this.stateController.clearEntities();
        this.socket.close();
        console.log("Disconnected");
    },

    //Setters
    setLeftSpectator: function(isLeftSpectator) {
        this.leftSpectator = isLeftSpectator;
    },

    //Getters
    getStateController: function() {
        return this.stateController;
    },

    /**
     * if not in game: -1
     * else: >= 0
     * @return {int} id
     */
    getSelfId: function() {
        return this.selfId;
    },

    /**
     * if spectator: false
     * else: true
     * @return {Boolean}
     */
    isLeftSpectator: function() {
        return this.leftSpectator;
    },
});
