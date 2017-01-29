var Tile = require('./tile'),
    PlayerController = require('./playercontroller'),
    ShootController = require('./shootcontroller'),
    cfg = require('../shared/config');

/* jshint loopfunc:true */
exports = module.exports = TileController;

function TileController() {
    this.tiles = [];
    this.nextIdSpec = 0;
    this.nextIdPlayer = 0;
    this.nextIdShoot = 0;
    this.nextIdFood = 0;

    var getNextId = function(flag) {
        return this.getNextId(flag);
    }.bind(this);

    this.playerController = new PlayerController(getNextId);
    this.shootController = new ShootController(this.playerController.getEntities());

    var players = this.playerController.getEntities();

    for (var x = 0; x < cfg.tileAmountX; x++) {
        var tilesRow = [];
        for (var y = 0; y < cfg.tileAmountY; y++) {
            var newTile = new Tile(x, y, players, getNextId);
            tilesRow.push(newTile);
        }
        this.tiles.push(tilesRow);
    }
}


TileController.prototype = {
    getTile: function(x, y) {
        var X = Math.floor(cfg.tileAmountX * (x + cfg.endLimitRad) / (2 * cfg.endLimitRad));
        var Y = Math.floor(cfg.tileAmountY * (y + cfg.endLimitRad) / (2 * cfg.endLimitRad));

        return this.tiles[X][Y];
    },

    getTilesInScope: function(x, y) {
        var tilesInScope = [];
        var X = Math.floor(cfg.tileAmountX * (x + cfg.endLimitRad) / (2 * cfg.endLimitRad));
        var Y = Math.floor(cfg.tileAmountY * (y + cfg.endLimitRad) / (2 * cfg.endLimitRad));

        var scopeX = (cfg.tileScopeAmountX - 1) / 2;
        var scopeY = (cfg.tileScopeAmountY - 1) / 2;
        for (var i = -scopeX; i < scopeX; i++) {
            for (var j = -scopeY; j < scopeY; j++) {
                if (X + i >= 0 && Y + j >= 0 &&
                    X + i < cfg.tileAmountX && Y + j < cfg.tileAmountY) {
                    tilesInScope.push(this.tiles[X + i][Y + j]);
                }
            }
        }
        return tilesInScope;
    },

    /**
     * each controller has a counter
     * OPTI: id limit
     * @param  {int} flag
     * @return {int}      id
     */
    getNextId: function(flag) {
        switch (flag) {
            case 0:
                return this.nextIdSpec++;
            case 1:
                return this.nextIdPlayer++;
            case 2:
                return this.nextIdShoot++;
            case 3:
                return this.nextIdFood++;
            default:
                break;
        }
    },


    getPlayerController: function() {
        return this.playerController;
    },

    getShootController: function() {
        return this.shootController;
    },
};
