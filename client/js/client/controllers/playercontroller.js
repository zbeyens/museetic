var EntityController = require('./entitycontroller'),
    Player = require('./entities/player');

exports = module.exports = PlayerController;

function PlayerController() {
    EntityController.call(this);
    this.board = [];
    this.updatedBoard = false;
}
PlayerController.prototype = _.extend(Object.create(EntityController.prototype), {
    /**
     * add player from updatePs msg
     * @param {int} id
     * @param {string} name
     */
    add: function(id, name) {
        var player = new Player(id, name);
        this.entities.push(player);
        return player;
    },

    //Setters
    setBoard: function(board) {
        this.board = board;
    },

    setUpdatedBoard: function(updatedBoard) {
        this.updatedBoard = updatedBoard;
    },

    //Getters
    getBoard: function() {
        return this.board;
    },

    isUpdatedBoard: function() {
        return this.updatedBoard;
    },
});
