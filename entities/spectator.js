var gamer = require('./gamer'),
    cfg = require('../shared/config');

exports = module.exports = Spectator;

function Spectator(id) {
    gamer.call(this, id);
    this.inGame = false;
    this.state = {
        x: 0,
        y: 0,
        mass: 0,
    };
    this.setScope();
}

Spectator.prototype = Object.create(gamer.prototype);
