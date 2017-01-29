var lot = require('../shared/lot');


/*
Has an array of entity.
Can add and remove entities.
*/

exports = module.exports = EntityController;

function EntityController() {
    this.entities = [];
    this.tickPhysics = 0;
    this.lastPhysicsTs = new Date();
}

EntityController.prototype = {
    /**
     * remove the entity from socket
     * @param  {Entity} entity
     * @return {void}
     */
    remove: function(entity) {
        var idx = this.entities.indexOf(entity);
        if (idx >= 0) {
            this.entities.splice(idx, 1);
        }
    },

    //Setters
    setLastPhysicsTs: function(lastPhysicsTs) {
        this.lastPhysicsTs = lastPhysicsTs;
    },

    //Getters
    getEntities: function() {
        return this.entities;
    },

    getLastPhysicsTs: function() {
        return this.lastPhysicsTs;
    },
};
