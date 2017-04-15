var EntityController = require('./entitycontroller'),
    Food = require('../entities/food'),
    lot = require('../shared/lot'),
    _ = require('underscore');

/* jshint shadow:true */
exports = module.exports = FoodController;

function FoodController(players, getNextId) {
    EntityController.call(this);

    this.players = players;
    this.getNextId = getNextId;
}

FoodController.prototype = _.extend(Object.create(EntityController.prototype), {
    add: function(mass) {
        var id = this.getNextId(3);

        var newFood = new Food(id, mass);
        this.entities.push(newFood);

        for (var i = this.players.length; i--;) {
            var player = this.players[i];
            player.addFoodToAdd(newFood);
        }

        return newFood;
    },

    remove: function(entity, referrerId) {
        var idx = this.entities.indexOf(entity);
        if (idx >= 0) {

            for (var i = this.players.length; i--;) {
                var player = this.players[i];
                player.addFoodToRemove(this.entities[idx], referrerId);
            }

            this.entities.splice(idx, 1);
        }
    }
});
