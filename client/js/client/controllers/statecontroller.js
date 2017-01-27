var cfg = require('../../../../shared/config'),
    lot = require('../../../../shared/lot'),
    GamePhysics = require('../../../../shared/core'),
    Update = require('./update'),
    PlayerController = require('./playercontroller'),
    FoodController = require('./foodcontroller'),
    ShootController = require('./shootcontroller');

exports = module.exports = StateController;

function StateController() {
    this.isSpectator = true;
    this.serverTime = 0;
    this.renderTime = 0;
    this.interpolationTime = cfg.clientInterpolationTime;
    this.smoothingFactor = cfg.clientSmoothingFactor;

    this.playerController = new PlayerController();
    this.foodController = new FoodController();
    this.shootController = new ShootController();

    if (cfg.debug) {
        this.debug = new Debug();
    }
    this.lagCompensation = cfg.serverLagCompensation;
    this.i = 0;
}
StateController.prototype = {
    /**
     * TODO: reset leaderboard
     * onDisconnect: just clear
     * startGame: isSpectator = false to avoid spectator spawn in game
     * @return {void}
     */
    clearEntities: function() {
        console.log("removing");
        this.playerController.clearEntities();
        this.foodController.clearEntities();
        this.shootController.clearEntities();
    },

    /**
     * update all the player states if they have at least one Update
     * @return {void}
     */
    updatePlayerStates: function() {
        var entities = this.playerController.getEntities();
        for (var i = entities.length; i--;) {
            var entity = entities[i];
            if (entity.getUpdates().length) {
                this.updatePlayerState(entity);
            }
        }
    },

    /**
     * update one player: interpolation of player updates
     * for a new player, no lerp till interpolationTime
     *
     * @param  {Player} entity
     * @return {void}
     */
    updatePlayerState: function(entity) {
        var pos, interpolationFactor, newState,
            pos = entity.getInterpolatedUpdates(this.renderTime);

        if (pos.previous && pos.target) {
            interpolationFactor = this.getInterpolatedValue(pos.previous.time, pos.target.time, this.renderTime + this.elapsedLastUpdate);

            newState = GamePhysics.getInterpolatedEntityState(pos.previous.state, pos.target.state, interpolationFactor);
            // console.log(pos.previous.state);
            // console.log(newState.x);
            // console.log(entity.state.x);
            // console.log(pos.target.state);
            // newState = GamePhysics.getInterpolatedEntityState(entity.state, newState, this.smoothingFactor);
            // console.log(newState.x);
            entity.setState(newState);
            // console.log(entity.state.x);


            //entities can be drawed after the first state interpolation
            if (!entity.isVisible()) {
                entity.setVisible(true);
            }

        } else {
            //remove after interpolationTime
            if (entity.isToRemove()) {
                this.playerController.removeEntity(entity);
            }
        }
    },

    getInterpolatedValue: function(previousTime, targetTime, renderTime) {
        var range = targetTime - previousTime,
            difference = renderTime - previousTime;
        var ratio = difference / range;
        // console.log(ratio);
        if (ratio > 1) ratio = 1;
        var value = parseFloat(ratio.toFixed(3));
        // console.log((difference / range));
        return value;
    },

    predictShootStates: function(deltaTime) {
        var entities = this.shootController.getEntities();
        for (var i = entities.length; i--;) {
            var shoot = entities[i];
            var newState = GamePhysics.getNewShootState(shoot, deltaTime);
            if (newState) {
                shoot.setState(newState);
            } else {
                this.shootController.removeEntity(shoot);
            }
        }
    },

    predictFoodStates: function(deltaTime) {
        var entities = this.foodController.getEntities();
        for (var i = entities.length; i--;) {
            var food = entities[i];

            var newState = GamePhysics.getNewFoodState(food, deltaTime);
            if (newState) {
                food.setState(newState);
            } else {
                this.foodController.removeEntity(food);
            }
        }
    },

    /**
     * if player new: add player(id, name)
     * else: add update(state, time) to player from id
     *
     * for all updatePs, player.inScope = true
     * for all player not in updatePs (in scope), setToRemove
     * @param {time} time     serverTs
     * @param {list} updatePs array of array: players to update
     */
    addPlayerUpdates: function(time, updatePs) {
        for (var i = updatePs.length; i--;) {
            var playerState = updatePs[i],
                player;

            var j = lot.idxOf(this.playerController.getEntities(), 'id', playerState[0]);
            if (j >= 0) {
                player = this.playerController.getEntities()[j];
            } else {
                player = this.playerController.add(playerState[0], playerState[2]);
            }
            player.addUpdate(playerState[1], time);
            player.inScope = true;
        }
        var entities = this.playerController.getEntities();
        for (var i = entities.length; i--;) {
            var player = entities[i];
            if (!player.inScope) {
                player.setToRemove(true);
            } else {
                player.inScope = false;
            }
        }
    },

    updateShootStates: function(dataInit) {
        this.initStates(dataInit, this.shootController);
    },

    /**
     * call initStates with foodController
     * @param  {list} dataInit : all foods to init
     * @return {void}
     */
    updateFoodInitStates: function(dataInit) {
        this.initStates(dataInit, this.foodController);
    },

    /**
     * add an Entity after lerp
     * @param  {list} states : all entities to init
     * @param  {object} controller
     * @return {void}
     */
    initStates: function(states, controller) {
        var self = this;
        var beforeSpectator = this.isSpectator;
        // console.log('1:' + self.isSpectator);

        for (var i = states.length; i--;) {
            (function() {
                var entityState = states[i];

                setTimeout(function() {
                    // console.log('2:' + self.isSpectator);
                    var newEntity = controller.add(entityState[0]);
                    newEntity.setState(entityState[1]);
                }, self.interpolationTime);
            })();
        }
    },

    /**
     *  remove the outscope food after lerp
     * @param  {list} dataRemove : all foods to be removed
     * @return {void}
     */
    updateFoodRemoveStates: function(dataRemove) {
        var self = this;

        for (var i = dataRemove.length; i--;) {
            (function() {
                var entityId = dataRemove[i];
                setTimeout(function() {
                    var foods = self.foodController.getEntities();
                    var idx = lot.idxOf(foods, 'id', entityId);
                    if (idx >= 0) {
                        self.foodController.remove(idx);
                    }
                }, self.interpolationTime);
            })();
        }
    },

    /**
     *  add a referrer (player) to each food after lerp
     * @param  {list} dataEat : all foods to be eaten by referrerId
     * @return {void}
     */
    updateFoodEatStates: function(dataEat) {
        var self = this;

        for (var i = dataEat.length; i--;) {
            (function() {
                var foodId = dataEat[i][0],
                    referrerId = dataEat[i][1];
                setTimeout(function() {
                    var foods = self.foodController.getEntities();
                    //optional check
                    var idx = lot.idxOf(foods, 'id', foodId);
                    if (idx >= 0) {
                        var food = foods[idx];
                        var players = self.playerController.getEntities();
                        var idxPlayer = lot.idxOf(players, 'id', referrerId);
                        if (idxPlayer >= 0) {
                            var player = players[idxPlayer];
                            food.referrer = player;
                        }
                    }
                }, self.interpolationTime);
            })();
        }
    },

    updateBoard: function(data) {
        if (data.length) {
            this.playerController.setBoard(data);
            this.playerController.setUpdatedBoard(true);
        }
    },

    //Remove

    /**
     * client render in the past to have at least 2 known position during the interpolationTime
     * @param {time} serverTime
     */
    setTime: function(serverTime) {
        this.serverTime = serverTime;
        this.elapsedLastUpdate = 0;
        this.lastUpdateTime = new Date();
        this.renderTime = this.serverTime - this.interpolationTime;
    },


    //Getters
    getPlayerController: function() {
        return this.playerController;
    },

    getFoodController: function() {
        return this.foodController;
    },

    getShootController: function() {
        return this.shootController;
    },

    getRenderTime: function() {
        return this.renderTime;
    }
};
