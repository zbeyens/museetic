var Client = require('./client/client'),
    GamePhysics = require('../../shared/core'),
    GameLoop = require('./gameloop'),
    Canvas = require('./canvas/canvas'),
    THREExKeyboardState = require('./keyboard'),
    MouseState = require('./mouse'),
    cfg = require('../../shared/config');

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
    var HOST = location.origin.replace(/^http/, 'ws');
    var ws = new WebSocket(HOST);
    ws.binaryType = 'arraybuffer';
    ws.onopen = function(event) {
        //NOTE: lost one day because of setTimeout(0): first msg not received
        this.client = new Client(ws);
        this.startGame();
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


                var nowTs = new Date();
                lastTs = lastTs || nowTs;
                var deltaTime = (nowTs - lastTs);
                lastTs = nowTs;
                stateController.setElapsedLastUpdate(nowTs);
                stateController.updatePlayerStates();

                stateController.predictShootStates(deltaTime);
                stateController.predictFoodStates(deltaTime);

                this.processInputs();
            }.bind(this),
            //Render Loop
            function() {
                var stateController = this.client.getStateController(),
                    playerController = stateController.getPlayerController(),
                    foodController = stateController.getFoodController(),
                    shootController = stateController.getShootController();

                this.removeRemovedEntitiesSprites(playerController, foodController, shootController);
                var players = playerController.getEntities(),
                    foods = foodController.getEntities(),
                    shoots = shootController.getEntities();

                if (this.client.isLeftSpectator()) {
                    signPanelDiv.style.display = 'none';
                    hudDiv.style.visibility = 'visible';
                    this.canvas.hud.visible = true;

                    selfId = this.client.getSelfId();
                    this.client.setLeftSpectator(false);
                }

                var selfState = playerController.getEntityState(selfId);
                if (selfState.mass !== undefined) {
                    //if mass changes, resize
                    if (selfState.mass !== selfMass) {
                        selfMass = selfState.mass;
                        this.canvas.resizeMass(selfMass);
                    }

                    this.canvas.drawMap(selfState);

                    for (var i = foods.length; i--;) {
                        var food = foods[i];
                        if (!food.isVisible()) continue;
                        this.canvas.drawFood(food, selfState);
                    }
                    for (var i = shoots.length; i--;) {
                        var shoot = shoots[i];
                        if (!shoot.isVisible()) continue;
                        this.canvas.drawShoot(shoot, selfState);
                    }
                    for (var i = players.length; i--;) {
                        var player = players[i];
                        if (!player.isVisible()) continue;
                        this.canvas.drawPlayer(player, selfState);
                    }

                    this.canvas.drawHud(selfState);
                    if (playerController.isUpdatedBoard()) {
                        this.canvas.drawBoard(playerController.getBoard());
                        playerController.setUpdatedBoard(false);
                    }

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

    removeRemovedEntitiesSprites: function(playerController, foodController, shootController) {
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
