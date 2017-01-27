var GamerController = require('./gamercontroller'),
    Spectator = require('../entities/spectator');

/*
Has an array of player.
Can add and remove players, and addInput to a player.
*/

exports = module.exports = SpectatorController;

function SpectatorController(getNextId) {
    GamerController.call(this);
    this.getNextId = getNextId;
}

SpectatorController.prototype = Object.create(GamerController.prototype);

/**
 * Flag 0
 */
SpectatorController.prototype.add = function() {
    var id = this.getNextId(0);

    var newSpectator = new Spectator(id);
    this.entities.push(newSpectator);

    return newSpectator;
};
