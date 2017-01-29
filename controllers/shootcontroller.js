var EntityController = require('./entitycontroller'),
    Shoot = require('../entities/shoot'),
    _ = require('underscore');

/* jshint shadow:true */
exports = module.exports = ShootController;

function ShootController(players) {
    EntityController.call(this);

    this.players = players;
}

ShootController.prototype = _.extend(Object.create(EntityController.prototype), {

    add: function(referrerPlayer) {
        var newShoot = new Shoot(referrerPlayer.id, referrerPlayer.state);
        this.entities.push(newShoot);

        return newShoot;
    },

    remove: function(entity) {
        var idx = this.entities.indexOf(entity);
        if (idx >= 0) {

            for (var i = this.players.length; i--;) {
                var player = this.players[i];
                var idxbis = player.sInScope.indexOf(this.entities[idx]);
                if (idxbis >= 0) {
                    player.removeShootInScope(idxbis);
                }
            }

            this.entities.splice(idx, 1);
        }
    },
});
