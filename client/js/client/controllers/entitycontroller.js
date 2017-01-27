var lot = require('../../../../shared/lot'),
    cfg = require('../../../../shared/config');

exports = module.exports = EntityController;

/**
 * entities: to render
 * removedEntities: sprites to remove
 */
function EntityController() {
    this.entities = [];
    this.removedEntities = [];
}

EntityController.prototype = {
    //Remove
    removeEntity: function(entity) {
        var i = this.entities.indexOf(entity);
        this.remove(i);
    },

    /**
     * add the Entity to remove in removedEntities and remove from entities
     * (used for outscope)
     * @param  {int} i : entities index
     * @return {void}
     */
    remove: function(i) {
        if (i >= 0) {
            this.removedEntities.push(this.entities[i]);
            this.entities.splice(i, 1);
        }
    },

    /**
     * onDisconnect, game over, change server, change mode
     * entities sprite to remove
     * @return {void}
     */
    clearEntities: function() {
        for (var i = this.entities.length; i--;) {
            this.removedEntities.push(this.entities[i]);
            this.entities.splice(i, 1);
        }
    },

    /**
     * after sprites removed
     * @return {void}
     */
    clearRemovedEntities: function() {
        this.removedEntities = [];
    },

    //Getters
    getEntities: function() {
        return this.entities;
    },

    getRemovedEntities: function() {
        return this.removedEntities;
    },

    /**
     * return a state: spectator or player
     * @param  {int} id
     * @return {object}    state
     */
    getEntityState: function(id) {
        var state = false;

        if (id === -1) {
            state = cfg.spectatorInitState;
        }

        var i = lot.idxOf(this.entities, 'id', id);
        if (i >= 0) {
            state = this.entities[i].state;
        }
        // console.log("iii" + id);
        return state;
    }
};
