var Update = require('./../update'),
    cfg = require('./../../../../../shared/config');

exports = module.exports = Entity;

function Entity(id) {
    this.id = id;
    this.state = {};
    this.updates = []; //only players
    this.visible = false; //wait lerpTime before rendering
    setTimeout(function() {
        this.visible = true;
    }.bind(this), cfg.clientInterpolationTime);

    this.toRemove = false;
}

Entity.prototype = {
    //not used
    addUpdate: function(state, time) {
        var newUpdate = new Update(state, time);
        if (this.updates.length === 0) {
            this.state = newUpdate.state;
        }
        this.updates.push(newUpdate);
        if (this.updates.length > cfg.clientMaxUpdateBuffer) {
            this.updates.splice(0, 1);
        }
    },

    //Setters
    setState: function(state) {
        this.state = state;
    },

    setToRemove: function(toRemove) {
        this.toRemove = toRemove;
    },

    //Getters
    getUpdates: function() {
        return this.updates;
    },

    /**
     * find the 2 updates bounding renderTime
     * @param  {time} time : renderTime
     * @return {object}      pos{previous, target}
     */
    getInterpolatedUpdates: function(renderTime) {
        var pos = {};
        for (var i = 0; i < this.updates.length - 1; i++) {
            var previous = this.updates[i],
                target = this.updates[i + 1];
            if (renderTime >= previous.time && renderTime < target.time) {
                pos.previous = previous;
                pos.target = target;
                break;
            }
        }
        return pos;
    },

    getId: function() {
        return this.id;
    },

    isVisible: function() {
        return this.visible;
    },

    isToRemove: function() {
        return this.toRemove;
    }
};
