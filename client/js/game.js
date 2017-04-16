import Canvas from './canvas/canvas';
import Dom from './dom/Dom';

const Client = require('./client/client'),
// GamePhysics = require('../../shared/core'),
GameLoop = require('./gameloop'),
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
    this.cv = new Canvas(this);
    this.dom = new Dom();
    this.keyboard = new Keyboard();
    this.mouse = new Mouse(this.cv.canvas);
    
    window.addEventListener('resize', (e) => {
        this.cv.cam.resizeCamera();
        this.dom.resize();
    });
    this.cv.cam.resizeCamera();
    this.dom.resize();
    
    const HOST = location.origin.replace(/^http/, 'ws');
    const ws = new WebSocket(HOST);
    ws.binaryType = 'arraybuffer';
    ws.onopen = function(event) {
        //NOTE: lost one day because of setTimeout(0): first msg not received
        this.client = new Client(ws);
        this.startGame();
    }.bind(this);
}

Game.prototype = {
    startGame: function() {
        let selfId = this.client.getSelfId();
        let selfMass = 0;
        let lastTs = null;
        let deltaTime = 0;
        
        this.gameloop.start(
            //Update Loop
            () => {
                const stateController = this.client.getStateController();
                
                const nowTs = new Date();
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
                        selfId = this.updateGameOver();
                    }
                }
                if (selfId === -1) return;
                
                this.processInputs();
            },
            //Render Loop
            () => {
                if (!this.cv.assetsLoaded) return;
                
                if (selfId !== -1) {
                    this.cv.cam.smoothResize(deltaTime);
                }
                
                const stateController = this.client.getStateController(),
                playerController = stateController.getPlayerController(),
                foodController = stateController.getFoodController(),
                shootController = stateController.getShootController();
                
                this.removeRemovedEntitiesSprites(playerController, foodController, shootController);
                const players = playerController.getEntities(),
                foods = foodController.getEntities(),
                shoots = shootController.getEntities();
                
                //if the client is in game or spectator, render
                const selfState = playerController.getEntityState(selfId);
                if (selfState.mass !== undefined) {
                    //if mass changes, resize
                    if (selfState.mass !== selfMass) {
                        selfMass = selfState.mass;
                        this.cv.cam.resizeMass(selfMass);
                    }
                    
                    this.cv.vmap.drawMap(selfState);
                    
                    for (let i = foods.length; i--;) {
                        const food = foods[i];
                        if (!food.isVisible()) continue;
                        this.cv.vfood.drawFood(food, selfState);
                    }
                    for (let i = shoots.length; i--;) {
                        const shoot = shoots[i];
                        if (!shoot.isVisible()) continue;
                        this.cv.vshoot.drawShoot(shoot, selfState);
                    }
                    for (let i = players.length; i--;) {
                        const player = players[i];
                        if (!player.isVisible()) continue;
                        this.cv.vplayer.drawPlayer(player, selfState);
                        
                        // if (!player.state.immunity) {
                        const balls = player.getBallController().getEntities();
                        for (let j = balls.length; j--;) {
                            const ball = balls[j];
                            // if (!ball.isVisible()) continue;
                            this.cv.vball.drawBall(ball, selfState);
                        }
                        // }
                    }
                    
                    this.cv.hud.drawHud(selfState);
                    if (playerController.isUpdatedBoard()) {
                        this.dom.leaderboard.updateBoard(playerController.getBoard());
                        playerController.setUpdatedBoard(false);
                    }
                    
                    this.cv.render();
                }
                
                this.cv.hud.fps.setFps(new Date());
            }
        );
    },
    
    processInputs: function() {
        this.processKeyboard();
        this.processMouse();
    },
    
    processKeyboard: function() {
        const leftEU = this.keyboard.pressed('leftEU');
        const leftUS = this.keyboard.pressed('leftUS');
        const left = leftEU || leftUS;
        const right = this.keyboard.pressed('right');
        const space = this.keyboard.pressed('space');
        
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
        
        const wheeled = this.mouse.wheeled();
        if (wheeled > 0) {
            this.cv.cam.zoomIn(wheeled);
        } else if (wheeled < 0) {
            this.cv.cam.zoomOut(-wheeled);
        }
    },
    
    /**
    * start a new game with a new id
    * @return {int} new id of the client
    */
    updateNewGame: function() {
        this.dom.newGame();
        this.cv.hud.container.visible = true;
        this.mouse.running = true;
        
        this.client.setInTransition(false);
        return this.client.getSelfId();
    },
    
    updateGameOver: function() {
        this.dom.gameOver();
        this.cv.hud.container.visible = false;
        this.mouse.running = false;
        
        this.client.setInTransition(false);
        return -1;
    },
    
    removeRemovedEntitiesSprites: function(playerController, foodController, shootController) {
        this.cv.removeSprites(playerController.getRemovedEntities(), foodController.getRemovedEntities(), shootController.getRemovedEntities());
        playerController.clearRemovedEntities();
        shootController.clearRemovedEntities();
        foodController.clearRemovedEntities();
    }
};

//NOTE?
const signForm = document.getElementById("playForm");
signForm.onsubmit = function(e) {
    e.preventDefault();
    return false;
};

const game = new Game();
