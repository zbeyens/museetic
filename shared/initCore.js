var lot = require('./lot'),
    cfg = require('./config');

exports.getInitPlayerState = function() {
    return {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        ring: false,
        mass: cfg.playerInitMass,
        dashing: false,

        startTime: new Date(),
        lastRing: new Date(),
        lastDash: new Date(),
        canDash: false,
        immunity: true,
    };
};

exports.getInitSpectatorState = function() {
    return {
        x: 0,
        y: 0,
        mass: 0,
    };
};

exports.getInitFoodState = function() {
    var pos = lot.getRandomPos(cfg.midLimitRad - 50, cfg.midLimitRad + cfg.midLimitStroke + 50, cfg.endLimitRad - 50);
    return {
        x: pos.x,
        y: pos.y,
    };
};

//referrerPlayer
exports.getInitBallState = function(referrerState, mass, angle) {
    var radius = lot.getRingRadius(referrerState.mass);
    var pos = lot.getBallPos(referrerState.x, referrerState.y, radius, angle);
    return {
        x: pos.x,
        y: pos.y,
        mass: mass,
        angle: angle,
        active: true, //
    };
};
