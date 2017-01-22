var EntityController = require('./entitycontroller'),
    Food = require('../entities/food'),
    lot = require('../shared/lot');

/* jshint shadow:true */
exports = module.exports = FoodController;

function FoodController(spectators, players, getNextId) {
    EntityController.call(this);

    this.spectators = spectators;
    this.players = players;
    this.getNextId = getNextId;
}

FoodController.prototype = Object.create(EntityController.prototype);

FoodController.prototype.add = function() {
    var id = this.getNextId(3);

    var newFood = new Food(id);
    this.entities.push(newFood);

    for (var i = this.spectators.length; i--;) {
        var spectator = this.spectators[i];
        spectator.addFoodToAdd(newFood);
    }
    for (var i = this.players.length; i--;) {
        var player = this.players[i];
        player.addFoodToAdd(newFood);
    }

    return newFood;
};

FoodController.prototype.remove = function(entity, referrerId) {
    var idx = this.entities.indexOf(entity);
    if (idx >= 0) {

        for (var i = this.spectators.length; i--;) {
            var spectator = this.spectators[i];
            spectator.addFoodToRemove(this.entities[idx], referrerId);
        }
        for (var i = this.players.length; i--;) {
            var player = this.players[i];
            player.addFoodToRemove(this.entities[idx], referrerId);
        }

        this.entities.splice(idx, 1);
    }
};
