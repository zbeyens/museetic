var Update = require('./../update');

exports = module.exports = Entity;

function Entity(id) {
    this.id = id;
    this.state = {};
    this.updates = [];
    this.visible = false;
    this.toRemove = false;
}

Entity.prototype = {
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

    setVisible: function(visible) {
        this.visible = visible;
    },

    setToRemove: function(toRemove) {
        this.toRemove = toRemove;
    },

    //Getters
    getUpdates: function() {
        return this.updates;
    },


    getInterpolatedUpdates: function(time) {
        var pos = {};
        // console.log(this.updates[this.updates.length - 1]);
        // console.log(this.updates[0]);
        // console.log(time);
        var found = false;
        for (var i = 0; i < this.updates.length - 1; i++) {
            var previous = this.updates[i],
                target = this.updates[i + 1];
            if (time >= previous.time && time < target.time) {
                pos.previous = previous;
                pos.target = target;
                found = true;
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
