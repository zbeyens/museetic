var Entity = require('./entity'),
    Update = require('./../update'),
    cfg = require('../../../../../shared/config');


exports = module.exports = Player;

/**
 * name
 * state {x, y, angle, mass}
 *
 * @param {int} id
 * @param {string} name
 */
function Player(id, name) {
    Entity.call(this, id);
    this.name = name;
    // this.inputController = 1;
}

Player.prototype = _.extend(Object.create(Entity.prototype), {
    /**
     * if first update: player.state = new state
     * else: use last update to have a complete new state
     *
     * add update from updatePs msg
     * remove the first update if full
     * this buffer length allows to handle lags.
     *
     * @param {object} state : new state
     * @param {time} time
     */
    addUpdate: function(state, time) {
        var newState = state;
        if (this.updates.length === 0) {
            this.state = state;
        } else {
            var preState = this.updates[this.updates.length - 1].state;
            if (state.x === undefined) {
                newState.x = preState.x;
            }
            if (state.y === undefined) {
                newState.y = preState.y;
            }
            if (state.vx === undefined) {
                newState.vx = preState.vx;
            }
            if (state.vy === undefined) {
                newState.vy = preState.vy;
            }
            if (state.ring === undefined) {
                newState.ring = preState.ring;
            }
            if (state.mass === undefined) {
                newState.mass = preState.mass;
            }
            if (state.dashing === undefined) {
                newState.dashing = preState.dashing;
            }
        }

        var newUpdate = new Update(newState, time);
        this.updates.push(newUpdate);
        if (this.updates.length > cfg.clientMaxUpdateBuffer) {
            this.updates.splice(0, 1);
        }
    }
});
