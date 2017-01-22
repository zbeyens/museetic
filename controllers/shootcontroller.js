var EntityController = require('./entitycontroller'),
    Shoot = require('../entities/shoot');

/* jshint shadow:true */
exports = module.exports = ShootController;

function ShootController(spectators, players) {
    EntityController.call(this);

    this.spectators = spectators;
    this.players = players;
}

ShootController.prototype = Object.create(EntityController.prototype);

ShootController.prototype.add = function(referrerPlayer) {
    var newShoot = new Shoot(referrerPlayer.id, referrerPlayer.state);
    this.entities.push(newShoot);

    for (var i = this.spectators.length; i--;) {
        var spectator = this.spectators[i];
    }
    for (var i = this.players.length; i--;) {
        var player = this.players[i];
    }

    return newShoot;
};

ShootController.prototype.remove = function(entity) {
    var idx = this.entities.indexOf(entity);
    if (idx >= 0) {

        for (var i = this.spectators.length; i--;) {
            var spectator = this.spectators[i];
            var idxbis = spectator.sInScope.indexOf(this.entities[idx]);
            if (idxbis >= 0) {
                spectator.removeShootInScope(idxbis);
            }
        }
        for (var i = this.players.length; i--;) {
            var player = this.players[i];
            var idxbis = player.sInScope.indexOf(this.entities[idx]);
            if (idxbis >= 0) {
                player.removeShootInScope(idxbis);
            }
        }

        this.entities.splice(idx, 1);
    }
};
