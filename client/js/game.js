var Client = require('./client'),
    GamePhysics = require('../../shared/core'),
    GameLoop = require('./gameloop'),
    Canvas = require('./canvas'),
    THREExKeyboardState = require('./keyboard'),
    MouseState = require('./mouse'),
    cfg = require('../../shared/config');

/* jshint shadow:true */
/*
initializeClient : startGame (onReady) : start game loop.
update entity and player current states (on input, onUpdateClientPredictionReady)
getInterpolatedState (onInterpolation)
*/

function Game() {
    this.keyboard = new THREExKeyboardState();
    this.gameloop = new GameLoop();
    this.canvas = new Canvas();
    this.mouse = new MouseState(this.canvas.canvas);
    var HOST = location.origin.replace(/^http/, 'ws')
    var ws = new WebSocket(HOST);
    ws.binaryType = 'arraybuffer';
    ws.onopen = function(event) {
        setTimeout(function() {
            this.client = new Client(ws);
            this.startGame();
        }.bind(this), 0);
    }.bind(this);
}

Game.prototype = {
    startGame: function() {
        var selfId = this.client.getSelfId();
        var selfMass = 0;
        var lastTs = null;

        this.gameloop.start(
            //Update Loop
            function() {
                var stateController = this.client.getStateController();

                stateController.updatePlayerStates();

                var nowTs = new Date();
                lastTs = lastTs || nowTs;
                var deltaTime = (nowTs - lastTs);
                lastTs = nowTs;
                stateController.predictShootStates(deltaTime);
                stateController.predictFoodStates(deltaTime);

                this.processInputs();
            }.bind(this),
            //Render Loop
            function() {
                var stateController = this.client.getStateController(),
                    playerController = stateController.getPlayerController(),
                    foodController = stateController.getFoodController(),
                    shootController = stateController.getShootController(),
                    players = playerController.getEntities(),
                    foods = foodController.getEntities(),
                    shoots = shootController.getEntities();

                if (this.client.isLeftSpectator()) {
                    signPanelDiv.style.display = 'none';
                    hudDiv.style.visibility = 'visible';
                    this.canvas.hud.visible = true;

                    selfId = this.client.getSelfId();
                    this.client.setLeftSpectator(false);
                    this.clearRemovedEntities(playerController, foodController, shootController);
                }

                var selfState = playerController.getEntityState(selfId);

                if (selfState.mass !== undefined) {
                    if (selfState.mass !== selfMass) {
                        selfMass = selfState.mass;
                        this.canvas.resizeMass(selfMass);
                    }

                    this.canvas.drawMap(selfState);

                    for (var i = foods.length; i--;) {
                        this.canvas.drawFood(foods[i], selfState);
                    }
                    for (var i = shoots.length; i--;) {
                        this.canvas.drawShoot(shoots[i], selfState);
                    }
                    for (var i = players.length; i--;) {
                        if (players[i].isVisible()) {
                            this.canvas.drawPlayer(players[i], selfState);
                        }
                    }

                    this.canvas.drawHud(selfState);
                    if (playerController.isUpdatedBoard()) {
                        this.canvas.drawBoard(playerController.getBoard());
                        playerController.setUpdatedBoard(false);
                    }

                    this.clearRemovedEntities(playerController, foodController, shootController);

                    this.canvas.render();
                }

                this.canvas.fps.setFps(new Date());
            }.bind(this)
        );
    },

    processInputs: function() {
        var left = this.keyboard.pressed('left');
        var right = this.keyboard.pressed('right');
        var space = this.keyboard.pressed('space');

        if (left && this.keyboard.keyUp.left) {
            this.client.onInput(10);
            this.keyboard.keyUp.left = false;
        }

        if (right && this.keyboard.keyUp.right) {
            this.client.onInput(11);
            this.keyboard.keyUp.right = false;
        }

        if (space && this.keyboard.keyUp.space) {
            this.client.onInput(12);
            this.keyboard.keyUp.space = false;
        }

        if (this.mouse.click) {
            this.client.onInput(13);
            this.mouse.click = false;
        }

        if (!left) {
            this.keyboard.keyUp.left = true;
        }
        if (!right) {
            this.keyboard.keyUp.right = true;
        }
        if (!space) {
            this.keyboard.keyUp.space = true;
        }
    },

    clearRemovedEntities: function(playerController, foodController, shootController) {
        this.canvas.removeSprites(playerController.getRemovedEntities(), foodController.getRemovedEntities(), shootController.getRemovedEntities());
        playerController.clearRemovedEntities();
        shootController.clearRemovedEntities();
        foodController.clearRemovedEntities();
    }
};

var signForm = document.getElementById("sign-form");
signForm.onsubmit = function(e) {
    e.preventDefault();
    return false;
};

var game = new Game();
