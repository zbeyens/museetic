var EntityController = require('./entitycontroller'),
    Ball = require('./entities/ball');

exports = module.exports = BallController;

function BallController(referrerId, ballAngle, ballStartTime) {
    EntityController.call(this);

    this.nextId = 1;
    this.referrerId = referrerId;
    this.ballAngle = ballAngle;
    this.ballLastTime = ballStartTime;
}

BallController.prototype = _.extend(Object.create(EntityController.prototype), {
    add: function(referrerState) {
        var newBall = new Ball(this.nextId++, this.referrerId, referrerState);
        this.entities.push(newBall);

        return newBall;
    },

    getBallAngle: function() {
        return this.ballAngle;
    },

    getBallLastTime: function() {
        return this.ballLastTime;
    },

    setBallAngle: function(ballAngle) {
        this.ballAngle = ballAngle;
    },

    setBallLastTime: function(ballLastTime) {
        this.ballLastTime = ballLastTime;
    },
});
