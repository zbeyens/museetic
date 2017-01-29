var FoodController = require('./foodcontroller');

exports = module.exports = Tile;

function Tile(x, y, players, getNextId) {
    this.x = x;
    this.y = y;

    this.foodController = new FoodController(players, getNextId);
}

Tile.prototype = {
    getFoodController: function() {
        return this.foodController;
    },
};
