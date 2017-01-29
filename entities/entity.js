exports = module.exports = Entity;

function Entity(id) {
    this.state = {};
    this.id = id;
}

Entity.prototype = {
    setState: function(state) {
        this.state = state;
    },
};
