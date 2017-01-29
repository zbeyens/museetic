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

    this.tickPhysics = 0;
    this.lastPhysicsTs = 0;

    this.tickMain = 0;
    this.lastMainTs = 0;
    this.tickBoard = 0;

    this.server = new Server(wss);

    this.fps = new Fps();
    this.fps.startServer();
}

Game.prototype = {
    start: function() {
        this.startTime = new Date();
        this.lastPhysicsTs = new Date();
        this.lastMainTs = new Date();

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
            var localTime = this.lastPhysicsTs - this.startTime;
            this.server.getStateController().broadcastState(localTime);
        }.bind(this), 0);

        var nowTs = new Date();
        var deltaTime = (nowTs - this.lastMainTs);
        this.tickMain += deltaTime;
        this.lastMainTs = nowTs;
        if (this.tickMain < cfg.tickMain) return;
        this.tickMain = 0;

        this.tickBoard++;
        if (this.tickBoard < cfg.tickBoard) return;
        this.tickBoard = 0;

        setTimeout(function() {
            this.server.getStateController().updateBoard();
        }.bind(this), 0);
    },

    //Updates
    updateEntities: function() {
        this.tickPhysics++;
        if (this.tickPhysics < cfg.tickPhysics) return;
        this.tickPhysics = 0;

        var now = new Date();
        var physicsDelta = (now - this.lastPhysicsTs);

        var stateController = this.server.getStateController();
        stateController.updatePlayerStates(physicsDelta / 1000.0);
        this.lastPhysicsTs = now;
        var localTime = this.lastPhysicsTs - this.startTime;
        console.log("updat " + localTime);
        stateController.updateShootStates(physicsDelta);
    },
};
