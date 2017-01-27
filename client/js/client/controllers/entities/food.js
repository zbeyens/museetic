var Entity = require('./entity');

exports = module.exports = Food;

/**
 * Food entity, state:
 * xReal, yReal: hitbox,
 * x, y: random position,
 * vr - random circular speed: Math.random()
 * angle 0: random circular direction
 * movingTime 0: when eating
 *
 * @param {int} id
 */
function Food(id) {
    Entity.call(this, id);
    this.state.movingTime = 0;
}

Food.prototype = Object.create(Entity.prototype);
