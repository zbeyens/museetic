var entity = require('./entity'),
    lot = require('../shared/lot'),
    cfg = require('../shared/config');

exports = module.exports = Gamer;

function Gamer(id) {
    entity.call(this, id);
    this.tickState = 0;
    this.tickScope = 0;

    this.firstState = true;
    this.updatedBoard = true;
    this.pInScope = [];
    this.sInScope = [];
    this.fInScope = [];

    this.foodsToAdd = [];
    this.foodsToRemove = [];

    this.scope = {};
}

Gamer.prototype = Object.create(entity.prototype);

Gamer.prototype.getFoodsToSpawn = function(states) {
    var playerScope = this.getScope();

    for (var i = this.foodsToAdd.length; i--;) {
        var checkFood = this.foodsToAdd[i];

        if (lot.inRect(checkFood.state.x, checkFood.state.y, this.state.x, this.state.y, playerScope.minScopeWInit, playerScope.minScopeHInit)) {
            this.addFoodInScope(checkFood);
            states.foodsScopeInit.push([checkFood.id, checkFood.state]);
        }
    }
    this.foodsToAdd = [];
};

Gamer.prototype.getFoodsToEat = function(states) {
    for (var i = this.foodsToRemove.length; i--;) {
        var checkFood = this.foodsToRemove[i];

        var idx = lot.idxOf(this.fInScope, 'id', checkFood[0].id);
        if (idx >= 0) {
            this.removeFoodInScope(idx);
            states.foodsScopeEat.push([checkFood[0].id, checkFood[1]]);
        }
    }
    this.foodsToRemove = [];
};

//Add
Gamer.prototype.addPlayerInScope = function(entity) {
    this.pInScope.push(entity);
};

Gamer.prototype.addShootInScope = function(entity) {
    this.sInScope.push(entity);
};

Gamer.prototype.addFoodInScope = function(entity) {
    this.fInScope.push(entity);
};


Gamer.prototype.addFoodToAdd = function(toAdd) {
    this.foodsToAdd.push(toAdd);
};

Gamer.prototype.addFoodToRemove = function(toRemove, referrerId) {
    this.foodsToRemove.push([toRemove, referrerId]);
};

//Remove
Gamer.prototype.removePlayerInScope = function(idx) {
    this.pInScope.splice(idx, 1);
};

Gamer.prototype.removeShootInScope = function(idx) {
    this.sInScope.splice(idx, 1);
};

Gamer.prototype.removeFoodInScope = function(idx) {
    this.fInScope.splice(idx, 1);
};


//Setters
Gamer.prototype.setScope = function() {
    this.scope = {
        maxScopeWInit: (cfg.scopeInitX / 2) / lot.getScaleMass(this.state.mass) + 600,
        maxScopeHInit: (cfg.scopeInitY / 2) / lot.getScaleMass(this.state.mass) + 600,
        minScopeWInit: (cfg.scopeInitX / 2) / lot.getScaleMass(this.state.mass) + 400,
        minScopeHInit: (cfg.scopeInitY / 2) / lot.getScaleMass(this.state.mass) + 400,
    };
};

Gamer.prototype.setFirstState = function(firstState) {
    this.firstState = firstState;
};

Gamer.prototype.setUpdatedBoard = function(updatedBoard) {
    this.updatedBoard = updatedBoard;
};

//Getters
Gamer.prototype.getScope = function() {
    return this.scope;
};

Gamer.prototype.isFirstState = function() {
    return this.firstState;
};

Gamer.prototype.isUpdatedBoard = function() {
    return this.updatedBoard;
};
