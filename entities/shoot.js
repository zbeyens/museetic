var entity = require('./entity');

exports = module.exports = Shoot;

function Shoot(referrerId, referrerState) {
    entity.call(this, null);
    this.state = {
        x: referrerState.x,
        y: referrerState.y,
        mass: referrerState.mass,
        lifeTime: 0,
        ring: false,
    };
    this.referrerId = referrerId;
}

Shoot.prototype = Object.create(entity.prototype);

Shoot.prototype.getShootState = function() {
    return {
        x: this.state.x,
        y: this.state.y,
        mass: this.state.mass,
        lifeTime: this.state.lifeTime,
    };
};
