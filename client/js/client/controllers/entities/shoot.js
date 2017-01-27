var Entity = require('./entity');

exports = module.exports = Shoot;

function Shoot(id) {
    Entity.call(this, id);
}

Shoot.prototype = Object.create(Entity.prototype);
