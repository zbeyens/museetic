var Entity = require('./entity');

exports = module.exports = Food;

/**
 * Food entity, state:
 * xReal, yReal: hitbox,
 * x, y: random position,
 * vr - random circular speed: Math.random()
 * angle 0: random circular direction
 * movingTime 0: limit time of moving (when eating)
 *
 * @param {int} id
 */
function Food(id, mass) {
    Entity.call(this, id);
    this.state.movingTime = 0;
    this.mass = mass;
}

Food.prototype = Object.create(Entity.prototype);
