var TileController = require('./tilecontroller'),
    lot = require('../shared/lot'),
    GamePhysics = require('../shared/core');

/* jshint shadow:true */
/*
Start broadcast state loop : get and broadcast state of players and entities.
Instanciate a playercontroller and entitycontroller.
*/

exports = module.exports = StateController;

function StateController(broadcastCallback) {
    this.startTime = 0;
    this.sockets = [];
    this.broadcastCallback = broadcastCallback;

    this.tileController = new TileController();

    this.sizeObject = 0;
}

StateController.prototype = {
    //Updates
    updatePlayerStates: function() {
        var players = this.tileController.getPlayerController().getEntities();

        for (var i = players.length; i--;) {
            var player = players[i];

            player.tickPhysics++;
            if (player.tickPhysics < 17) continue;
            player.tickPhysics = 0;
            var physicsDelta = lot.getDeltaTs(player, 'lastPhysicsTs') / 1000.0;

            var newState = GamePhysics.getNewPlayerState(player, physicsDelta, this.tileController);

            if (newState) {
                player.setState(newState);
            } else {
                this.tileController.getPlayerController().remove(player);
            }
        }
    },

    updateShootStates: function() {
        var shoots = this.tileController.getShootController().getEntities();

        for (var i = shoots.length; i--;) {
            var shoot = shoots[i];

            shoot.tickPhysics++;
            if (shoot.tickPhysics < 17) continue;
            shoot.tickPhysics = 0;
            var physicsDelta = lot.getDeltaTs(shoot, 'lastPhysicsTs');

            var newState = GamePhysics.getNewShootState(shoot, physicsDelta);

            if (newState) {
                shoot.setState(newState);
            } else {
                this.tileController.getShootController().remove(shoot);
            }
        }
    },

    updateBoard: function() {
        var playerController = this.tileController.getPlayerController();
        var oldBoard = playerController.getBoard();
        var newBoard = [];
        var players = playerController.getEntities();
        for (var i = players.length; i--;) {
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

    //Broadcast
    broadcastState: function(startTime) {

        for (var i = this.sockets.length; i--;) {
            var socket = this.sockets[i];
            var gamer = socket.player;

            gamer.tickState++;
            if (gamer.tickState < 50) continue;
            gamer.tickState = 0;
            gamer.tickScope++;

            var localTime = new Date() - startTime,
                states = {
                    packet: 'update',
                    t: localTime,
                    updatePs: [],
                    shootsScopeInit: [],
                    foodsScopeInit: [],
                    foodsScopeRemove: [],
                    foodsScopeEat: [],
                    updateBoard: []
                };

            this.getPlayersInScope(gamer, states);
            this.getShootsInScope(gamer, states);
            gamer.getFoodsToSpawn(states);
            gamer.getFoodsToEat(states);

            if (gamer.tickScope >= 8 || gamer.isFirstState()) {
                gamer.tickScope = 0;
                this.getFoodsInScope(gamer, states);
                this.getUpdatedBoard(gamer, states);

                if (gamer.isFirstState()) {
                    gamer.setFirstState(false);
                }
            }

            this.broadcastCallback(socket, states);

            if (this.sizeObject !== lot.sizeObject(states)) {
                // console.log('Size : ' + lot.sizeObject(states));
                this.sizeObject = lot.sizeObject(states);
            }
        }
    },

    getPlayersInScope: function(gamer, states) {
        var playerScope = gamer.getScope();

        var entities = this.tileController.getPlayerController().getEntities();
        for (var i = entities.length; i--;) {
            var checkPlayer = entities[i],
                scope = lot.getScope(playerScope, checkPlayer.state.mass);

            var idx = lot.idxOf(gamer.pInScope, 'id', checkPlayer.id);
            if (idx >= 0) {
                if (!lot.inRect(checkPlayer.state.x, checkPlayer.state.y, gamer.state.x, gamer.state.y, scope.maxScopeW, scope.maxScopeH)) {
                    gamer.removePlayerInScope(idx);
                } else {
                    var updatedState = checkPlayer.getPlayerState(idx, gamer);
                    gamer.pInScope[idx] = {
                        id: checkPlayer.id,
                        state: checkPlayer.state,
                    };
                    states.updatePs.push([checkPlayer.id, updatedState]);
                }
            } else {
                if (lot.inRect(checkPlayer.state.x, checkPlayer.state.y, gamer.state.x, gamer.state.y, scope.minScopeW, scope.minScopeH)) {
                    var updatedState = checkPlayer.getFirstPlayerState();
                    gamer.addPlayerInScope({
                        id: checkPlayer.id,
                        state: checkPlayer.state,
                    });
                    states.updatePs.push([checkPlayer.id, updatedState, checkPlayer.name]);
                }
            }

        }
    },

    getShootsInScope: function(gamer, states) {
        var playerScope = gamer.getScope();

        var entities = this.tileController.getShootController().getEntities();
        for (var i = entities.length; i--;) {
            var checkShoot = entities[i],
                scope = lot.getScope(playerScope, checkShoot.state.mass);

            var idx = gamer.sInScope.indexOf(checkShoot);
            if (idx >= 0) {
                if (!lot.inRect(checkShoot.state.x, checkShoot.state.y, gamer.state.x, gamer.state.y, scope.maxScopeW, scope.maxScopeH)) {
                    gamer.removeShootInScope(idx);
                }
            } else {
                if (lot.inRect(checkShoot.state.x, checkShoot.state.y, gamer.state.x, gamer.state.y, scope.minScopeW, scope.minScopeH)) {
                    var initState = checkShoot.getShootState();
                    gamer.addShootInScope(checkShoot);
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
    getFoodsInScope: function(gamer, states) {
        var playerScope = gamer.getScope();


        var tiles = this.tileController.getTilesInScope(gamer.state.x, gamer.state.y);
        for (var j = 0; j < tiles.length; j++) {
            var entities = tiles[j].getFoodController().getEntities();
            for (var i = entities.length; i--;) {
                var checkFood = entities[i];

                var idx = gamer.fInScope.indexOf(checkFood);
                if (idx >= 0) {
                    if (!lot.inRect(checkFood.state.x, checkFood.state.y, gamer.state.x, gamer.state.y, playerScope.maxScopeWInit, playerScope.maxScopeHInit)) {
                        gamer.removeFoodInScope(idx);
                        states.foodsScopeRemove.push(checkFood.id);
                    }
                } else {
                    if (lot.inRect(checkFood.state.x, checkFood.state.y, gamer.state.x, gamer.state.y, playerScope.minScopeWInit, playerScope.minScopeHInit)) {
                        gamer.addFoodInScope(checkFood);
                        states.foodsScopeInit.push([checkFood.id, checkFood.state]);
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
