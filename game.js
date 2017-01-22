var cfg = require('./shared/config'),
    crypto = require('crypto'),
    Server = require('./server'),
    Fps = require('./shared/fps');

/*
Start physics loop on existing players and entities : get and update a new state.
Instanciate and start a server.
Scenario :
-Start - (update):
    Server: (update/state LOOP) -- REG
    Client: initializeClient -- REG (signInReponse)
-onConnection - signInReponse, (update):
    Server: addPlayer, FIRST state update/broadcast
    Client: initializeClient-onReady, (update)/render LOOP -- REG
-onUpdate - update:
    Client: FIRST update: playerController.add, newPlayer.addUpdate, newUpdate.state
            NEXT update: player.updateState, addUpdate, updates.push
            render: getPlayerStates, processEntityStatesCurrent(playerController), draw
-onInput - i, update:
    Client: addInput
    Server: addPlayerInput, NEXT state update: updateState, entity.setState
            addEntity(newId, id), updateEntityState, removeEntity
    Client: updateEntities, newEntity
-onDisconnect - rp:
    Server: removePlayer
    Client: removePlayer
*/

exports = module.exports = Game;

function Game(wss) {
    this.startTime = 0;

    this.lastMainTs = new Date();

    this.tickMain = 0;
    this.tickBoard = 0;

    this.server = new Server(wss);

    this.fps = new Fps();
    this.fps.startServer();
}

Game.prototype = {
    start: function() {
        this.startTime = new Date();
        setInterval(function() {
            this.mainLoop();
        }.bind(this), 1);

        setInterval(function() {
            this.fps.setFps(new Date());
        }.bind(this), 1000 / 60);
    },

    mainLoop: function() {
        setTimeout(function() {
            this.updateEntities();
        }.bind(this), 0);

        setTimeout(function() {
            this.server.getStateController().broadcastState(this.startTime);
        }.bind(this), 0);

        var nowTs = new Date();
        var deltaTime = (nowTs - this.lastMainTs);
        this.tickMain += deltaTime;
        this.lastMainTs = nowTs;
        if (this.tickMain < 50) return;
        this.tickMain = 0;

        this.tickBoard++;
        if (this.tickBoard < 10) return;
        this.tickBoard = 0;

        setTimeout(function() {
            this.server.getStateController().updateBoard();
        }.bind(this), 0);
    },

    //Updates
    updateEntities: function() {
        var stateController = this.server.getStateController();
        stateController.updatePlayerStates();
        stateController.updateShootStates();
    },
};
