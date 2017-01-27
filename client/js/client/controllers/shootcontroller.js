var EntityController = require('./entitycontroller'),
    Shoot = require('./entities/shoot');

exports = module.exports = ShootController;

function ShootController() {
    EntityController.call(this);
}
ShootController.prototype = Object.create(EntityController.prototype);
ShootController.prototype.add = function(id) {
    var shoot = new Shoot(id);
    this.entities.push(shoot);
    return shoot;
};
