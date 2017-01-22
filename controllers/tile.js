var FoodController = require('./foodcontroller');

exports = module.exports = Tile;

function Tile(x, y, spectators, players, getNextId) {
    this.x = x;
    this.y = y;

    this.foodController = new FoodController(spectators, players, getNextId);
}

Tile.prototype = {
    getFoodController: function() {
        return this.foodController;
    },
};
