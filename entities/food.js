var entity = require('./entity'),
    cfg = require('../shared/config');

exports = module.exports = Food;

function Food(id, mass) {
    entity.call(this, id);
    
    this.mass = mass;
}

Food.prototype = Object.create(entity.prototype);
