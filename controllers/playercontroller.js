var EntityController = require('./entitycontroller'),
    Player = require('../entities/player'),
    lot = require('../shared/lot'),
    _ = require('underscore');

/* jshint shadow:true */
/*
Has an array of player.
Can add and remove players, and addInput to a player.
*/

exports = module.exports = PlayerController;

function PlayerController(getNextId) {
    EntityController.call(this);
    this.board = [];
    this.bestPlayer = null;

    this.getNextId = getNextId;
}

PlayerController.prototype = _.extend(Object.create(EntityController.prototype), {
    addSpectator: function() {
        var idSpec = this.getNextId(0);
        var newPlayer = new Player(idSpec);
        this.entities.push(newPlayer);

        return newPlayer;
    },

    addInGame: function(player, name) {
        player.addInGame(this.getNextId(1), name);
    },

    /**
     * if inGame and in scope of an other player:
     * remove him from player.pInScope
     * add him in player.playersToRemove
     * remove from entities
     * @param  {Player} entity : player to remove
     * @return {void}
     */
    remove: function(entity) {
        //check if entity connected
        var idx = this.entities.indexOf(entity);
        if (idx == -1) return;

        if (entity.id != -1) {
            for (var i = this.entities.length; i--;) {
                var player = this.entities[i];
                var idxbis = lot.idxOf(player.pInScope, 'id', entity.id);
                if (idxbis >= 0) {
                    player.removePlayerInScope(idxbis);
                }
                player.addPlayerToRemove(entity.id);
            }
        }

        this.entities.splice(idx, 1);
    },

    setBestPlayer: function(bestPlayer) {
        this.bestPlayer = bestPlayer;
    },

    setBoard: function(board) {
        this.board = board;
    },

    //Getters
    getBoard: function() {
        return this.board;
    },
});
