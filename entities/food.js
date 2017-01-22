var entity = require('./entity'),
    cfg = require('../shared/config');

exports = module.exports = Food;

function Food(id) {
    entity.call(this, id);
}

Food.prototype = Object.create(entity.prototype);
