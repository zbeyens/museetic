var EntityController = require('./entitycontroller');

/* jshint shadow:true */
/*
Has an array of player.
Can add and remove players, and addInput to a player.
*/

exports = module.exports = GamerController;


function GamerController() {
    EntityController.call(this);
    this.board = [];
    this.bestPlayer = null;
}

GamerController.prototype = Object.create(EntityController.prototype);

//Setters
GamerController.prototype.setBestPlayer = function(bestPlayer) {
    this.bestPlayer = bestPlayer;
};

GamerController.prototype.setBoard = function(board) {
    this.board = board;
};

//Getters
GamerController.prototype.getBoard = function() {
    return this.board;
};
