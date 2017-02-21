var EntityController = require('./entitycontroller'),
    Ball = require('../entities/ball'),
    _ = require('underscore');

exports = module.exports = BallController;

//use object instead of list
function BallController(referrerId) {
    EntityController.call(this);
    this.nextId = 1;
    this.referrerId = referrerId;
    this.ballAngle = 0;
    // this.players = players;
}

BallController.prototype = _.extend(Object.create(EntityController.prototype), {
    /**
     * take the first key of this.entities that is empty to add a new ball
     * @param {Ball} ball
     */
    add: function(referrerState) {
        // TODO: if not max
        console.log("new ball added " + this.nextId);
        var newBall = new Ball(this.nextId++, this.referrerId, referrerState);
        this.entities.push(newBall);

        return newBall;
        // this.entitiesToAdd.push(ball); //
        // this.entitiesToRemove.push([ball.id, ); //id ball
    },

    /**
     * get first ball angle
     * @return {float} angle
     */
    getBallAngle: function() {
        return this.ballAngle;
    },

    setBallAngle: function(ballAngle) {
        this.ballAngle = ballAngle;
    },

    //TODO
    remove: function(referrerPlayer, entity) {
        // var idx = this.entities.indexOf(entity);
        // if (idx >= 0) {
        //
        //     for (var i = this.players.length; i--;) {
        //         var player = this.players[i];
        //         var idxbis = player.bInScope.indexOf(this.entities[idx]);
        //         if (idxbis >= 0) {
        //             player.removeBallInScope(idxbis);
        //         }
        //     }
        //
        //     entity.removeFromReferrer();
        //     this.entities.splice(idx, 1);
        // }
    },
});
