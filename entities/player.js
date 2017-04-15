var Entity = require('../entities/entity'),
    BallController = require('../controllers/ballcontroller'),
    cfg = require('../shared/config'),
    ic = require('../shared/initCore'),
    lot = require('../shared/lot'),
    _ = require('underscore');

exports = module.exports = Player;

function Player(idSpec) {
    Entity.call(this, -1);
    this.idSpec = idSpec;
    this.tickState = 0;
    this.tickScope = 0;

    this.addInSpectator();
}

Player.prototype = _.extend(Object.create(Entity.prototype), {

    addInSpectator: function() {
        this.setState(ic.getInitSpectatorState());

        this.id = -1;
        this.name = undefined;
        this.ballController = undefined;

        this.reset();
    },

    /**
     * when Player submit, add him in game
     * @param {int} id
     * @param {string} name
     */
    addInGame: function(id, name) {
        this.setState(ic.getInitPlayerState());

        this.id = id;
        this.name = name;
        this.ballController = new BallController(this.id);

        this.reset();
    },

    /**
     * variable to reset when new game
     * @return {void}
     */
    reset: function() {
        this.firstState = true;
        this.updatedBoard = true;
        this.pInScope = [];
        this.sInScope = [];
        this.fInScope = [];

        this.playersToRemove = []; //id
        this.foodsToAdd = []; //Food
        this.foodsToRemove = []; //id, referrerId
    },


    addPlayerInScope: function(entity) {
        this.pInScope.push(entity);
    },

    addShootInScope: function(entity) {
        this.sInScope.push(entity);
    },

    addFoodInScope: function(entity) {
        this.fInScope.push(entity);
    },

    /**
     * players disconnected + no longer in scope
     * OPTI: object better than array ?
     * @param {int} toRemove : id player to remove
     */
    addPlayerToRemove: function(toRemove) {
        this.playersToRemove.push(toRemove);
    },

    addFoodToAdd: function(toAdd) {
        this.foodsToAdd.push(toAdd);
    },

    addFoodToRemove: function(toRemove, referrerId) {
        this.foodsToRemove.push([toRemove, referrerId]);
    },

    //Remove
    removePlayerInScope: function(idx) {
        this.pInScope.splice(idx, 1);
    },

    removeShootInScope: function(idx) {
        this.sInScope.splice(idx, 1);
    },

    removeFoodInScope: function(idx) {
        this.fInScope.splice(idx, 1);
    },

    //Setters
    setPressLeft: function(isPress) {
        this.pressLeft = isPress;
    },
    setPressRight: function(isPress) {
        this.pressRight = isPress;
    },
    setPressDash: function(isPress) {
        this.pressDash = isPress;
    },
    setPressClick: function(isPress) {
        this.pressClick = isPress;
    },

    setState: function(state) {
        this.state = state;
        this.setScope();
        this.pressLeft = false;
        this.pressRight = false;
        this.pressDash = false;
        this.pressClick = false;
    },

    /**
     * update the scope when the mass changes...
     * TODO: in setState
     */
    setScope: function() {
        this.scope = {
            maxScopeWInit: (cfg.scopeInitX / 2) / lot.getScaleMass(this.state.mass) + 600,
            maxScopeHInit: (cfg.scopeInitY / 2) / lot.getScaleMass(this.state.mass) + 600,
            minScopeWInit: (cfg.scopeInitX / 2) / lot.getScaleMass(this.state.mass) + 400,
            minScopeHInit: (cfg.scopeInitY / 2) / lot.getScaleMass(this.state.mass) + 400,
        };
    },

    setFirstState: function(firstState) {
        this.firstState = firstState;
    },

    setUpdatedBoard: function(updatedBoard) {
        this.updatedBoard = updatedBoard;
    },

    //Getters
    getScope: function() {
        return this.scope;
    },

    getBallController: function() {
        return this.ballController;
    },

    /**
     * broadcast
     * if new in scope, send all the state.
     * @return {object} updatedState
     */
    getFirstPlayerState: function() {
        var updatedState = {};

        updatedState.x = this.state.x;
        updatedState.y = this.state.y;
        updatedState.vx = this.state.vx;
        updatedState.vy = this.state.vy;
        // if (this.state.vx < 0) {
        //     updatedState.angle = Math.round((Math.PI + Math.atan2(this.state.vy, this.state.vx) - 8) * 1000);
        // } else {
        //     updatedState.angle = Math.round((Math.atan2(this.state.vy, this.state.vx) + 8) * 1000);
        // }
        updatedState.ring = this.state.ring;
        updatedState.dashing = this.state.dashing;
        updatedState.mass = this.state.mass;
        return updatedState;
    },

    /**
     * broadcast
     * if already in scope, update pInScope.
     * only send what have changed.
     * @param  {int} idx    : index in pInScope
     * @param  {player} player : we send to this player
     * @return {object}        updatedState
     */
    getPlayerState: function(idx, player) {
        var updatedState = {};

        if (this.state.x != player.pInScope[idx].state.x) {
            updatedState.x = this.state.x;
        }
        if (this.state.y != player.pInScope[idx].state.y) {
            updatedState.y = this.state.y;
        }
        // if (this.state.vx != player.pInScope[idx].state.vx ||
        //     this.state.vy != player.pInScope[idx].state.vy) {
        //     if (this.state.vx < 0) {
        //         updatedState.angle = Math.round((Math.PI + Math.atan2(this.state.vy, this.state.vx) - 8) * 1000);
        //     } else {
        //         updatedState.angle = Math.round((Math.atan2(this.state.vy, this.state.vx) + 8) * 1000);
        //     }
        //     console.log(updatedState.angle);
        // }
        if (this.state.vx != player.pInScope[idx].state.vx) {
            updatedState.vx = this.state.vx;
        }

        if (this.state.vy != player.pInScope[idx].state.vy) {
            updatedState.vy = this.state.vy;
        }

        if (this.state.mass != player.pInScope[idx].state.mass) {
            updatedState.mass = this.state.mass;
        }
        updatedState.ring = this.state.ring;
        updatedState.dashing = this.state.dashing;
        return updatedState;
    },

    /**
     * broadcast
     * every tickState, get players to remove
     * @param  {object} states to broadcast
     * @return {void}
     */
    getPlayersToRemove: function(states) {
        states.playersScopeRemove = states.playersScopeRemove.concat(this.playersToRemove);
        this.playersToRemove = [];
    },

    //broadcast
    getFoodsToSpawn: function(states) {
        var playerScope = this.scope;

        for (var i = this.foodsToAdd.length; i--;) {
            var checkFood = this.foodsToAdd[i];

            if (lot.inRect(checkFood.state.x, checkFood.state.y, this.state.x, this.state.y, playerScope.minScopeWInit, playerScope.minScopeHInit)) {
                this.addFoodInScope(checkFood);
                states.foodsScopeInit.push([checkFood.id, checkFood.state, checkFood.mass]);
            }
        }
        this.foodsToAdd = [];
    },

    //broadcast
    getFoodsToEat: function(states) {
        for (var i = this.foodsToRemove.length; i--;) {
            var checkFood = this.foodsToRemove[i];

            var idx = lot.idxOf(this.fInScope, 'id', checkFood[0].id);
            if (idx >= 0) {
                this.removeFoodInScope(idx);
                states.foodsScopeEat.push([checkFood[0].id, checkFood[1]]);
            }
        }
        this.foodsToRemove = [];
    },

    isFirstState: function() {
        return this.firstState;
    },

    isUpdatedBoard: function() {
        return this.updatedBoard;
    },
});
