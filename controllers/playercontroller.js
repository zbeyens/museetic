var GamerController = require('./gamercontroller'),
    Player = require('../entities/player'),
    lot = require('../shared/lot');

/* jshint shadow:true */
/*
Has an array of player.
Can add and remove players, and addInput to a player.
*/

exports = module.exports = PlayerController;

function PlayerController(spectators, getNextId) {
    GamerController.call(this);

    this.spectators = spectators;
    this.getNextId = getNextId;
}

PlayerController.prototype = Object.create(GamerController.prototype);

//Add
PlayerController.prototype.add = function(name) {
    var id = this.getNextId(1);

    var newPlayer = new Player(id, name);
    this.entities.push(newPlayer);

    for (var i = this.spectators.length; i--;) {
        var spectator = this.spectators[i];
    }
    for (var i = this.entities.length; i--;) {
        var player = this.entities[i];
    }

    return newPlayer;
};

PlayerController.prototype.remove = function(entity) {
    var idx = this.entities.indexOf(entity);
    if (idx >= 0) {

        for (var i = this.spectators.length; i--;) {
            var spectator = this.spectators[i];
            var idxbis = lot.idxOf(spectator.pInScope, 'id', this.entities[idx].id);
            if (idxbis >= 0) {
                spectator.removePlayerInScope(idxbis);
            }
        }
        for (var i = this.entities.length; i--;) {
            var player = this.entities[i];
            var idxbis = lot.idxOf(player.pInScope, 'id', this.entities[idx].id);
            if (idxbis >= 0) {
                player.removePlayerInScope(idxbis);
            }
        }

        this.entities.splice(idx, 1);
    }
};
