var lot = require('../shared/lot');

/* jshint shadow:true */
/*
Has an array of entity.
Can add and remove entities.
*/

exports = module.exports = EntityController;

function EntityController() {
    this.entities = [];
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

    //Getters
    getEntities: function() {
        return this.entities;
    },
};
