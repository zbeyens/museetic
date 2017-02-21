var cfg = require('../../../../shared/config'),
    lot = require('../../../../shared/lot'),
    GamePhysics = require('../../../../shared/core'),
    Update = require('./update'),
    PlayerController = require('./playercontroller'),
    FoodController = require('./foodcontroller'),
    ShootController = require('./shootcontroller');

exports = module.exports = StateController;

function StateController() {
    this.serverTime = 0;
    this.interpolationTime = cfg.clientInterpolationTime;
    this.rendered = 0;
    this.lastRenderTime = 0;
    this.rendering = false;

    this.smoothingFactor = cfg.clientSmoothingFactor;

    this.playerController = new PlayerController();
    this.foodController = new FoodController();
    this.shootController = new ShootController();

    if (cfg.debug) {
        this.debug = new Debug();
    }
    this.lagCompensation = cfg.serverLagCompensation;
}
StateController.prototype = {
    /**
     * TODO: reset leaderboard
     * onDisconnect: just clear
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
     * for a new player, no lerp till lerpTime
     * after lerpTime,
     *
     * @param  {Player} entity
     * @return {void}
     */
    updatePlayerState: function(entity) {


        // var lastDeltaTime = (entity.updates[entity.updates.length - 1].time - entity.updates[entity.updates.length - 2].time);

        var now = new Date();
        var rendered = 0;
        if (this.rendering) {
            rendered = this.rendered + (now - this.lastRenderTime);
        }
        // console.log(rendered);
        this.rendered = rendered;
        this.lastRenderTime = now;
        var renderTime = this.getRenderTime(rendered);

        var pos, interpolationFactor, newState,
            pos = entity.getInterpolatedUpdates(renderTime);

        // OPTI: jittering solution?
        if (!pos.previous && entity.isVisible()) {
            console.log("Jittering");
            // this.rendered = 0;
            // this.rendering = false;
            // newState = GamePhysics.getExtrapolatedPlayerState(entity.updates[entity.updates.length - 1], renderTime - entity.updates[entity.updates.length - 1].time);
            // entity.setState(newState);
        }
        if (pos.previous && pos.target) {
            interpolationFactor = this.getInterpolatedValue(pos.previous.time, pos.target.time, renderTime);
            // console.log(pos.previous.ballStartTime);
            // console.log(pos.previous.state.ballStartTime);
            // console.log(pos.previous.state.ballAngle);
            newState = GamePhysics.getInterpolatedEntityState(pos.previous.state, pos.target.state, interpolationFactor);
            // newState = GamePhysics.getInterpolatedEntityState(entity.state, newState, this.smoothingFactor);
            entity.setState(newState);

            this.predictBallStates(entity, renderTime);

            //only if interpolated
            this.rendering = true;
            // this.rendered = rendered;

            //entities can be drawed after the first state interpolation
            // if (!entity.isVisible()) {
            //     entity.setVisible(true);
            // }
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
        if (ratio > 1) ratio = 1;
        // console.log(ratio);
        // ratio = 1;
        var value = parseFloat(ratio.toFixed(3));
        // console.log((difference / range));
        return value;
    },

    getRenderTime: function(rendered) {
        // var renderTime = this.serverTime - interpolationTime + this.elapsedLastUpdate;
        // console.log(-interpolationTime + this.elapsedLastUpdate);
        var renderTime = this.serverTime - this.interpolationTime + rendered;
        // console.log(this.rendered);
        return renderTime;
    },

    /**
     * client render in the past to have at least 2 known position during the interpolationTime
     * @param {time} serverTime
     */
    setServerTime: function(serverTime) {
        this.serverTime = serverTime;
    },

    //only for client rendering
    setElapsedLastUpdate: function(deltaTime) {
        // console.log(now - this.lastUpdateTime);
        if (!this.serverTime) return;
        this.elapsedLastUpdate += deltaTime;
        // console.log(this.elapsedLastUpdate);
        // this.lastUpdateTime = now;
        // console.log(this.elapsedLastUpdate);
    },

    predictBallStates: function(player, renderTime) {
        var ballController = player.getBallController();
        var deltaTime = (renderTime - ballController.getBallLastTime()) / 1000.0;
        ballController.setBallLastTime(renderTime);

        var oldAngle = ballController.getBallAngle();
        var newAngle = GamePhysics.getNewBallAngle(oldAngle, deltaTime);
        ballController.setBallAngle(newAngle);

        GamePhysics.checkNewBalls(player);
        var balls = ballController.getEntities();
        for (var i = 0; i < balls.length; i++) {
            var ball = balls[i];
            // console.log(i + ":" + ball.state.angle);

            var newState = GamePhysics.getNewBallState(player.state, ball.state, newAngle, i);
            ball.setState(newState);
        }
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

    /**
     * predict food state: random or eating
     * remove if eaten
     * @param  {time} deltaTime rendering
     * @return {void}
     */
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
     * @param {time} time     serverTs
     * @param {list} updatePs array of array: players to update
     */
    addPlayerUpdates: function(time, updatePs) {
        for (var i = updatePs.length; i--;) {
            var playerState = updatePs[i],
                player;

            var id = playerState[0],
                state = playerState[1];

            var j = lot.idxOf(this.playerController.getEntities(), 'id', id);
            if (j >= 0) {
                player = this.playerController.getEntities()[j];
            } else {
                var name = playerState[2],
                    ballAngle = playerState[3];
                player = this.playerController.add(id, name, ballAngle, time);
            }
            player.addUpdate(state, time);
        }
        var entities = this.playerController.getEntities();
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

        for (var i = states.length; i--;) {
            var entityState = states[i];

            var newEntity = controller.add(entityState[0]);
            newEntity.setState(entityState[1]);
        }
    },

    /**
     *  remove players after lerpTime
     * @param  {list} dataRemove : all players to be removed
     * @return {void}
     */
    updatePlayerRemoveStates: function(dataRemove) {
        this.updateEntityRemoveStates(dataRemove, this.playerController);
    },

    /**
     *  remove outscope foods after lerpTime
     * @param  {list} dataRemove : all foods to be removed
     * @return {void}
     */
    updateFoodRemoveStates: function(dataRemove) {
        this.updateEntityRemoveStates(dataRemove, this.foodController);
    },

    /**
     * remove players/foods after lerpTime
     * @param  {list} dataRemove id to remove
     * @param  {Controller} controller
     * @return {void}
     */
    updateEntityRemoveStates: function(dataRemove, controller) {
        var self = this;

        for (var i = dataRemove.length; i--;) {
            (function() {
                var entityId = dataRemove[i];
                setTimeout(function() {
                    var entities = controller.getEntities();
                    var idx = lot.idxOf(entities, 'id', entityId);
                    if (idx >= 0) {
                        controller.remove(idx);
                    }
                }, self.interpolationTime);
            })();
        }
    },

    /**
     *  add a referrer (player) to each food after lerpTime
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
};
