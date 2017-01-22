exports = module.exports = Entity;

function Entity(id) {
    this.state = {};
    this.id = id;

    this.lastPhysicsTs = new Date();
    this.tickPhysics = 0;
}

Entity.prototype = {
    setState: function(state) {
        this.state = state;
    },
};
