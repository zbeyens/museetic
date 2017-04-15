var TileController = require('./tilecontroller'),
    lot = require('../shared/lot'),
    cfg = require('../shared/config'),
    GamePhysics = require('../shared/core');

/* jshint shadow:true */
/*
Start broadcast state loop : get and broadcast state of players and entities.
Instanciate a playercontroller and entitycontroller.
*/

exports = module.exports = StateController;

function StateController(broadcastCallback, clearCallback) {
    this.lastUpdate = 0;
    this.sockets = [];
    this.broadcastCallback = broadcastCallback;
    this.clearCallback = clearCallback;

    this.tileController = new TileController();

    this.sizeObject = 0;
}

StateController.prototype = {
    /**
     * updates the state of the players in game, at the same time!
     * using tickPhysics of each player
     *
     * remove player if dead
     * @return {void}
     */
    updatePlayerStates: function(physicsDelta) {
        var now = new Date();
        var playerController = this.tileController.getPlayerController();
        var players = playerController.getEntities();

        for (var i = players.length; i--;) {
            var player = players[i];
            if (player.id == -1) continue; //spectator

            var newState = GamePhysics.getNewPlayerState(player, physicsDelta, this.tileController);
            if (newState) {
                player.setState(newState);
                this.updateBallStates(player, physicsDelta);
            } else {
                //remove the player other's scope. Add in spectator. Send Clear.
                var idx = lot.idxOf(this.sockets, 'id', player.id);
                playerController.remove(player, false);
                player.addInSpectator();
                if (idx > -1) {
                    this.sockets[idx].id = player.id; //-1
                    this.clearCallback(this.sockets[idx]);
                }
            }

            var test = new Date() - now;
            if (test > 0) {
                console.log("Ouch " + test);
            }
        }
    },

    updateBallStates: function(player, physicsDelta) {
        var ballController = player.getBallController();
        var oldAngle = ballController.getBallAngle();
        var newAngle = GamePhysics.getNewBallAngle(oldAngle, physicsDelta);
        ballController.setBallAngle(newAngle);

        //add new balls then update them directly (mass, angle)
        GamePhysics.checkNewBalls(player);
        var balls = ballController.getEntities();
        for (var i = 0; i < balls.length; i++) {
            var ball = balls[i];

            var newState = GamePhysics.getNewBallState(player.state, ball.state, newAngle, i);
            ball.setState(newState);
        }
    },

    //Not sure if we should update ALL entities together.
    updateShootStates: function(physicsDelta) {
        var shootController = this.tileController.getShootController();
        var shoots = shootController.getEntities();

        for (var i = shoots.length; i--;) {
            var shoot = shoots[i];
            //should we compute physicsDelta here ?
            var newState = GamePhysics.getNewShootState(shoot, physicsDelta);

            if (newState) {
                shoot.setState(newState);
            } else {
                shootController.remove(shoot);
            }
        }
    },

    updateBoard: function() {
        var playerController = this.tileController.getPlayerController();
        var oldBoard = playerController.getBoard();
        var newBoard = [];
        var players = playerController.getEntities();
        for (var i = players.length; i--;) {
            if (players[i].id == -1) continue;

            if (newBoard.length < 10) {
                this.sortBoard(newBoard, players[i]);
            } else {
                // 10 in leadernewBoard already
                if (players[i].mass > newBoard[9].state.mass) {
                    newBoard.pop();
                    this.sortBoard(newBoard, players[i]);
                }
            }
        }

        if (oldBoard.toString() !== newBoard.toString() || oldBoard.length !== newBoard.length) {
            for (var i = players.length; i--;) {
                players[i].setUpdatedBoard(true);
            }
        }
        playerController.setBoard(newBoard);

        if (newBoard.length) {
            playerController.setBestPlayer(newBoard[0]);
        }
    },

    sortBoard: function(board, player) {
        if (board.length === 0) {
            board.push(player);
        } else {
            var found = false;

            for (var i = board.length; i--;) {
                if (player.state.mass <= board[i].state.mass) {
                    board.splice(i + 1, 0, player);
                    found = true;
                    break;
                }
            }

            if (!found) {
                board.splice(0, 0, player);
            }
        }
    },

    //Broadcast to players
    broadcastState: function(localTime) {
        for (var i = this.sockets.length; i--;) {
            var socket = this.sockets[i];
            var player = socket.player;

            player.tickState++;
            if (player.tickState < cfg.tickState) continue;
            player.tickState = 0;
            player.tickScope++;

            var states = {
                packet: 'update',
                t: localTime,
                updatePs: [],
                playersScopeRemove: [],
                shootsScopeInit: [],
                foodsScopeInit: [],
                foodsScopeRemove: [],
                foodsScopeEat: [],
                updateBoard: []
            };

            this.getPlayersInScope(player, states);
            this.getShootsInScope(player, states);
            player.getPlayersToRemove(states);
            // console.log(states.playersScopeRemove);
            player.getFoodsToSpawn(states);
            player.getFoodsToEat(states);

            //send directly if first state.
            if (player.tickScope >= cfg.tickScope || player.isFirstState()) {
                player.tickScope = 0;
                // console.log(player.fInScope);
                this.getFoodsInScope(player, states);
                this.getUpdatedBoard(player, states);

                if (player.isFirstState()) {
                    player.setFirstState(false);
                }
            }

            this.broadcastCallback(socket, states);
            // console.log("broad " + localTime);

            if (this.sizeObject !== lot.sizeObject(states)) {
                // console.log('Size : ' + lot.sizeObject(states));
                this.sizeObject = lot.sizeObject(states);
            }
        }
    },

    getPlayersInScope: function(player, states) {
        var playerScope = player.getScope();
        var entities = this.tileController.getPlayerController().getEntities();
        for (var i = entities.length; i--;) {
            if (entities[i].id == -1) continue; //don't send spectators state

            var checkPlayer = entities[i],
                scope = lot.getScope(playerScope, checkPlayer.state.mass);

            var idx = lot.idxOf(player.pInScope, 'id', checkPlayer.id);
            if (idx >= 0) {
                if (!lot.inRect(checkPlayer.state.x, checkPlayer.state.y, player.state.x, player.state.y, scope.maxScopeW, scope.maxScopeH)) {
                    player.removePlayerInScope(idx);
                    states.playersScopeRemove.push(checkPlayer.id);
                } else {
                    var updatedState = checkPlayer.getPlayerState(idx, player);
                    player.pInScope[idx] = {
                        id: checkPlayer.id,
                        state: checkPlayer.state,
                    };
                    states.updatePs.push([checkPlayer.id, updatedState]);
                }
            } else {
                if (lot.inRect(checkPlayer.state.x, checkPlayer.state.y, player.state.x, player.state.y, scope.minScopeW, scope.minScopeH)) {
                    var updatedState = checkPlayer.getFirstPlayerState();
                    player.addPlayerInScope({
                        id: checkPlayer.id,
                        state: checkPlayer.state,
                    });
                    var ballAngle = checkPlayer.getBallController().getBallAngle();
                    states.updatePs.push([checkPlayer.id, updatedState, checkPlayer.name, ballAngle]);
                }
            }

        }
    },

    getShootsInScope: function(player, states) {
        var playerScope = player.getScope();

        var entities = this.tileController.getShootController().getEntities();
        for (var i = entities.length; i--;) {
            var checkShoot = entities[i],
                scope = lot.getScope(playerScope, checkShoot.state.mass);

            var idx = player.sInScope.indexOf(checkShoot);
            if (idx >= 0) {
                if (!lot.inRect(checkShoot.state.x, checkShoot.state.y, player.state.x, player.state.y, scope.maxScopeW, scope.maxScopeH)) {
                    player.removeShootInScope(idx);
                }
            } else {
                if (lot.inRect(checkShoot.state.x, checkShoot.state.y, player.state.x, player.state.y, scope.minScopeW, scope.minScopeH)) {
                    var initState = checkShoot.getShootState();
                    player.addShootInScope(checkShoot);
                    states.shootsScopeInit.push(initState);
                }
            }
        }
    },


    // TODO: broadcast opti!
    // for (var i = 0; i < entities.length; i++) {
    //     var entity = entities[i];
    //     var alreadyInScope = {}
    //
    //     for (var j = entity.entitiesInScope.length - 1; j >= 0; j--) {
    //         var checkEntity = entity.entitiesInScope[j];
    //
    //         if (!check(checkEntity.state, entity.state)) {
    //            var id = entity.entitiesInScope.splice(-1, 1).id
    //         } else {
    //             alreadyInScope[checkEntity.id] = true;
    //         }
    //     }
    //
    //     for (var j = 0; j < entities.length; j++) {
    //         if (alreadyInScope.hasOwnProperty(entities[j].id) == false && check) {
    //             entity.entitiesInScope.push(entities[j])
    //         }
    //     }
    // }
    getFoodsInScope: function(player, states) {
        var playerScope = player.getScope();


        var tiles = this.tileController.getTilesInScope(player.state.x, player.state.y);
        for (var j = 0; j < tiles.length; j++) {
            var entities = tiles[j].getFoodController().getEntities();
            for (var i = entities.length; i--;) {
                var checkFood = entities[i];

                var idx = player.fInScope.indexOf(checkFood);
                if (idx >= 0) {
                    if (!lot.inRect(checkFood.state.x, checkFood.state.y, player.state.x, player.state.y, playerScope.maxScopeWInit, playerScope.maxScopeHInit)) {
                        player.removeFoodInScope(idx);
                        states.foodsScopeRemove.push(checkFood.id);
                    }
                } else {
                    if (lot.inRect(checkFood.state.x, checkFood.state.y, player.state.x, player.state.y, playerScope.minScopeWInit, playerScope.minScopeHInit)) {
                        player.addFoodInScope(checkFood);
                        states.foodsScopeInit.push([checkFood.id, checkFood.state, checkFood.mass]);
                    }
                }
            }
        }
    },

    getUpdatedBoard: function(player, states) {
        if (!player.isUpdatedBoard() || !this.tileController.getPlayerController().getBoard().length) {
            return;
        }

        var updatedBoard = [];
        var board = this.tileController.getPlayerController().getBoard();
        for (var i = 0; i < board.length; i++) {
            updatedBoard.push(board[i].name);
        }

        states.updateBoard = updatedBoard;
    },

    /**
     * add socket when connected
     * @param {socket} socket
     */
    addSocket: function(socket) {
        this.sockets.push(socket);
    },

    /**
     * remove socket when disconnected
     * @param  {socket} socket
     * @return {void}
     */
    removeSocket: function(socket) {
        var i = this.sockets.indexOf(socket);
        if (i >= 0) {
            this.sockets.splice(i, 1);
        }
    },

    //Setters

    //Getters
    getSockets: function() {
        return this.sockets;
    },

    getTileController: function() {
        return this.tileController;
    },
};
