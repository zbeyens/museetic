var gamer = require('./gamer'),
    cfg = require('../shared/config');

exports = module.exports = Player;

function Player(id, name) {
    gamer.call(this, id);
    this.state = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        ring: false,
        mass: cfg.playerInitMass,
        dashing: false,

        startTime: new Date(),
        lastRing: new Date(),
        lastDash: new Date(),
        canDash: false,
        immunity: true,
    };
    this.setScope();

    this.name = name;
    this.pressLeft = false;
    this.pressRight = false;
    this.pressDash = false;
    this.pressClick = false;
}

Player.prototype = Object.create(gamer.prototype);

//Setters
Player.prototype.setPressLeft = function(isPress) {
    this.pressLeft = isPress;
};
Player.prototype.setPressRight = function(isPress) {
    this.pressRight = isPress;
};
Player.prototype.setPressDash = function(isPress) {
    this.pressDash = isPress;
};
Player.prototype.setPressClick = function(isPress) {
    this.pressClick = isPress;
};

Player.prototype.setState = function(state) {
    this.state = state;
    this.pressLeft = false;
    this.pressRight = false;
    this.pressDash = false;
    this.pressClick = false;
};

//Getters
Player.prototype.getFirstPlayerState = function() {
    var updatedState = {};

    updatedState.x = this.state.x;
    updatedState.y = this.state.y;
    if (this.state.vx < 0) {
        updatedState.angle = Math.round((Math.PI + Math.atan2(this.state.vy, this.state.vx) - 8) * 1000);
    } else {
        updatedState.angle = Math.round((Math.atan2(this.state.vy, this.state.vx) + 8) * 1000);
    }
    updatedState.ring = this.state.ring;
    updatedState.dashing = this.state.dashing;
    updatedState.mass = this.state.mass;
    return updatedState;
};

Player.prototype.getPlayerState = function(idx, gamer) {
    var updatedState = {};

    if (this.state.x != gamer.pInScope[idx].state.x) {
        updatedState.x = this.state.x;
    }
    if (this.state.y != gamer.pInScope[idx].state.y) {
        updatedState.y = this.state.y;
    }
    if (this.state.vx != gamer.pInScope[idx].state.vx ||
        this.state.vy != gamer.pInScope[idx].state.vy) {
        if (this.state.vx < 0) {
            updatedState.angle = Math.round((Math.PI + Math.atan2(this.state.vy, this.state.vx) - 8) * 1000);
        } else {
            updatedState.angle = Math.round((Math.atan2(this.state.vy, this.state.vx) + 8) * 1000);
        }
    }
    if (this.state.mass != gamer.pInScope[idx].state.mass) {
        updatedState.mass = this.state.mass;
    }
    updatedState.ring = this.state.ring;
    updatedState.dashing = this.state.dashing;
    return updatedState;
};
