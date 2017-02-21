var Client = require('./client/client'),
    GamePhysics = require('../../shared/core'),
    GameLoop = require('./gameloop'),
    Canvas = require('./canvas/canvas'),
    Keyboard = require('./keyboard'),
    Mouse = require('./mouse'),
    cfg = require('../../shared/config');

/*
initializeClient : startGame (onReady) : start game loop.
update entity and player current states (on input, onUpdateClientPredictionReady)
getInterpolatedState (onInterpolation)
*/

function Game() {
    this.gameloop = new GameLoop();
    this.canvas = new Canvas();
    this.keyboard = new Keyboard();
    this.mouse = new Mouse(this.canvas.canvas);
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
        var deltaTime = 0;

        this.gameloop.start(
            //Update Loop
            function() {
                var stateController = this.client.getStateController();

                var nowTs = new Date();
                lastTs = lastTs || nowTs;
                deltaTime = (nowTs - lastTs);
                lastTs = nowTs;
                // stateController.setElapsedLastUpdate(deltaTime);
                stateController.updatePlayerStates();

                stateController.predictShootStates(deltaTime);
                stateController.predictFoodStates(deltaTime);

                //if new game or game over
                if (this.client.isInTransition()) {
                    if (selfId === -1) {
                        selfId = this.updateNewGame();
                    } else {
                        console.log("ooooh");
                        selfId = this.updateGameOver();
                    }
                }
                if (selfId === -1) return;

                this.processInputs();
            }.bind(this),
            //Render Loop
            function() {
                if (!this.canvas.assetsLoaded) return;

                if (selfId != -1) {
                    this.canvas.smoothResize(deltaTime);
                }

                var stateController = this.client.getStateController(),
                    playerController = stateController.getPlayerController(),
                    foodController = stateController.getFoodController(),
                    shootController = stateController.getShootController();

                this.removeRemovedEntitiesSprites(playerController, foodController, shootController);
                var players = playerController.getEntities(),
                    foods = foodController.getEntities(),
                    shoots = shootController.getEntities();

                //if the client is in game or spectator, render
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

                        // if (!player.state.immunity) {
                        var balls = player.getBallController().getEntities();
                        for (var j = balls.length; j--;) {
                            var ball = balls[j];
                            // if (!ball.isVisible()) continue;
                            this.canvas.drawBall(ball, selfState);
                        }
                        // }
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
        this.processKeyboard();
        this.processMouse();
    },

    processKeyboard: function() {
        var leftEU = this.keyboard.pressed('leftEU');
        var leftUS = this.keyboard.pressed('leftUS');
        var left = leftEU || leftUS;
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

        if (!left) {
            this.keyboard.keyUp.left = true;
        }
        if (!right) {
            this.keyboard.keyUp.right = true;
        }
        if (!space) {
            this.keyboard.keyUp.space = true;
        }

        if (cfg.debugMove) {
            this.keyboard.keyUp.left = true;
            this.keyboard.keyUp.right = true;
        }
    },

    processMouse: function() {
        if (this.mouse.click) {
            this.client.onInput(13);
            this.mouse.click = false;
        }

        var wheeled = this.mouse.wheeled();
        if (wheeled > 0) {
            this.canvas.zoomIn(wheeled);
        } else if (wheeled < 0) {
            this.canvas.zoomOut(-wheeled);
        }
    },

    /**
     * start a new game with a new id
     * @return {int} new id of the client
     */
    updateNewGame: function() {
        signPanelDiv.style.display = 'none';
        hudDiv.style.visibility = 'visible';
        this.canvas.hud.visible = true;
        this.mouse.running = true;

        this.client.setInTransition(false);
        return this.client.getSelfId();
    },

    updateGameOver: function() {
        signPanelDiv.style.display = 'block';
        hudDiv.style.visibility = 'hidden';
        this.canvas.hud.visible = false;
        this.mouse.running = false;

        this.client.setInTransition(false);
        return -1;
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
