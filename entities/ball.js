var Entity = require('./entity'),
    ic = require('../shared/initCore'),
    _ = require('underscore');

exports = module.exports = Ball;

function Ball(id, referrerId, referrerState) {
    Entity.call(this, id);
    this.referrerId = referrerId; //not needed to broadcast and update
    this.state = ic.getInitBallState(referrerState, 0, 0);
}

Ball.prototype = _.extend(Object.create(Entity.prototype), {
    //broadcast
    // getBallState: function() {
    //     //TODO: if not changed!
    //     return {
    //         mass: this.state.mass,
    //         angle: this.stage.angle,
    //     };
    // },

});
