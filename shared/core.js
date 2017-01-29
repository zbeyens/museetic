var cfg = require('./config'),
    // crypto = require('crypto'),
    lot = require('./lot');

/* jshint loopfunc:true */
/* jshint shadow:true */
/* jshint funcscope:true */

var isInMap = function(x, y) {
    var distFromO = lot.inCircle(0, 0, x, y);
    if (distFromO <= cfg.midLimitRad || (distFromO >= cfg.midLimitRad + cfg.midLimitStroke && distFromO <= cfg.endLimitRad) ||
        lot.inRect(x, y, -(cfg.midLimitRad + cfg.midLimitStroke / 2), 0, cfg.midLimitStroke + 100, cfg.tunnelHeight) ||
        lot.inRect(x, y, cfg.midLimitRad + cfg.midLimitStroke / 2, 0, cfg.midLimitStroke + 100, cfg.tunnelHeight)) {
        return true;
    } else {
        return false;
    }
};

var getInitPlayerState = function() {
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

var getInitFoodState = function() {
    var pos = lot.getRandomPos(cfg.midLimitRad - 50, cfg.midLimitRad + cfg.midLimitStroke + 50, cfg.endLimitRad - 50);
    return {
        x: pos.x,
        y: pos.y,
    };
};

exports.getNewPlayerState = function(player, deltaTime, tileController) {
    var id = player.id,
        state = player.state,
        playerController = tileController.getPlayerController(),
        shootController = tileController.getShootController(),
        newState = {};

    newState.x = state.x;
    newState.y = state.y;
    newState.ring = state.ring;
    newState.mass = state.mass;
    newState.dashing = state.dashing;

    newState.immunity = state.immunity;
    newState.startTime = state.startTime;
    newState.vx = state.vx;
    newState.vy = state.vy;
    newState.lastFlap = state.lastFlap;
    newState.lastRing = state.lastRing;
    newState.lastDash = state.lastDash;
    newState.canDash = state.canDash;
    newState.dashX = state.dashX;
    newState.dashY = state.dashY;
    newState.dashRange = state.dashRange;
    newState.dashDone = state.dashDone;

    var selfScope = lot.getSelfScope(newState.mass);

    processInputs(player, newState, tileController, shootController);
    checkImmunity(newState);

    if (newState.immunity) return newState;

    processMove(newState, deltaTime);
    var newTile = tileController.getTile(newState.x, newState.y);
    checkFoodsEating(newState, newTile, selfScope, player);
    checkRing(newState);

    if (newState.dashing) return newState;

    if (checkRingsKill(newState, tileController, playerController, selfScope, id) ||
        checkShootsKill(newState, tileController, shootController, selfScope, id))
        return getInitPlayerState();

    return newState;
};

var processInputs = function(player, newState, tileController, shootController) {
    if (player.pressLeft && !newState.dashing) {
        applyLeft(newState);
    } else if (player.pressRight && !newState.dashing) {
        applyRight(newState);
    } else if (player.pressDash && newState.canDash && newState.mass >= cfg.playerMinMassDash) {
        applyDash(player, newState, shootController);
    } else if (player.pressClick) {
        applySpawnFoods(tileController);
    }
};

var applyLeft = function(newState) {
    newState.vx = -cfg.playerVx;
    newState.vy = -cfg.playerVy;
    newState.lastFlap = new Date();
    if (newState.immunity) {
        newState.immunity = false;
    }
};

var applyRight = function(newState) {
    newState.vx = cfg.playerVx;
    newState.vy = -cfg.playerVy;
    newState.lastFlap = new Date();
    if (newState.immunity) {
        newState.immunity = false;
    }
};

var applyDash = function(player, newState, shootController) {
    //Reset dash, ring. Reduce mass.
    newState.dashing = true;
    newState.lastDash = new Date();
    newState.lastRing = new Date();
    newState.canDash = false;
    newState.ring = false;
    newState.mass = Math.round(newState.mass * cfg.dashMassLoss);
    player.setScope();

    applyShoot(player, newState, shootController);
};

var applyShoot = function(player, newState, shootController) {
    //New shoot
    // var newShoot = shootController.add(player);
    shootController.add(player);

    newState.dashX = newState.x;
    newState.dashY = newState.y;
    newState.dashRange = lot.getRingMax(newState.mass);
    newState.dashDone = 0;
};

var applySpawnFoods = function(tileController) {
    for (var j = 0; j < cfg.foodSpawnAmount; j++) {
        var foodState = getInitFoodState();
        var tile = tileController.getTile(foodState.x, foodState.y);
        var newFood = tile.getFoodController().add();
        newFood.setState(foodState);
    }
};

var checkImmunity = function(newState) {
    if (newState.immunity && new Date() - newState.startTime > cfg.playerImmunityTime) {
        newState.immunity = false;
        newState.vx = cfg.playerVx;
        newState.vy = cfg.playerVy;
    }
};

var processMove = function(newState, deltaTime) {
    var newPos;
    var angle = Math.atan2(newState.vy, newState.vx);

    if (!newState.dashing) {
        newPos = normalMove(newState, deltaTime);
    }
    if (newState.dashing && newState.dashDone < newState.dashRange) {
        newPos = dashMove(newState, deltaTime, angle);
    }
    if (newState.dashing && newState.dashDone >= newState.dashRange) {
        newPos = dashEndMove(newState, angle);
    }

    if (isInMap(newPos.x, newPos.y)) {
        newState.x = newPos.x;
        newState.y = newPos.y;
    } else {
        //return false;
    }
};

var normalMove = function(newState, deltaTime) {
    if (newState.vy < cfg.playerVy && new Date() - newState.lastFlap > 100) {
        newState.vy += cfg.playerGravity * deltaTime;
    }
    if (newState.vy > cfg.playerVy) {
        newState.vy = cfg.playerVy;
    }

    return {
        x: newState.x + newState.vx * deltaTime,
        y: newState.y + newState.vy * deltaTime,
    };
};

var dashMove = function(newState, deltaTime, angle) {
    newState.dashDone += cfg.dashSpeed * deltaTime;
    return {
        x: newState.x + cfg.dashSpeed * Math.cos(angle) * deltaTime,
        y: newState.y + cfg.dashSpeed * Math.sin(angle) * deltaTime,
    };
};

var dashEndMove = function(newState, angle) {
    newState.dashing = false;
    return {
        x: newState.dashX + newState.dashRange * Math.cos(angle),
        y: newState.dashY + newState.dashRange * Math.sin(angle),
    };
};

var checkFoodsEating = function(newState, newTile, selfScope, player) {
    //food eat and mass gain
    var foodController = newTile.getFoodController();
    var foods = foodController.getEntities();
    for (var i = foods.length; i--;) {
        var food = foods[i];

        var distPlayerFood = lot.inCircle(food.state.x, food.state.y, newState.x, newState.y);
        if (distPlayerFood < selfScope + cfg.foodHitbox) {
            newState.mass += cfg.foodMass;
            player.setScope();
            foodController.remove(food, player.id);
        }
    }
};

var checkRingsKill = function(newState, tileController, playerController, selfScope, id) {
    var players = playerController.getEntities();
    for (var j = players.length; j--;) {
        var enemy = players[j];
        if (enemy.id !== id && enemy.state.ring) {
            if (checkKill(newState, tileController, selfScope, enemy)) return true;
        }
    }
};

var checkShootsKill = function(newState, tileController, shootController, selfScope, id) {
    var shoots = shootController.getEntities();
    for (var j = shoots.length; j--;) {
        var shoot = shoots[j];
        if (shoot.referrerId !== id && shoot.state.ring) {
            if (checkKill(newState, tileController, selfScope, shoot)) return true;
        }
    }
};

var checkKill = function(newState, tileController, selfScope, killer) {
    var distPlayers = lot.inCircle(killer.state.x, killer.state.y, newState.x, newState.y);
    var minScope = lot.getRingMin(killer.state.mass);
    var maxScope = lot.getRingMax(killer.state.mass);

    if (minScope - selfScope < distPlayers && distPlayers < selfScope + maxScope) {
        for (var i = 0; i < 20; i++) {
            spawnFood(newState, tileController, i);
        }

        return true;
    }
};


var spawnFood = function(newState, tileController, iangle) {
    var foodState = {
        x: newState.x + Math.cos(Math.PI * iangle / 10) * lot.getRingMin(newState.mass),
        y: newState.y + Math.sin(Math.PI * iangle / 10) * lot.getRingMin(newState.mass),
    };
    var tileFood = tileController.getTile(foodState.x, foodState.y);
    var newFood = tileFood.getFoodController().add();
    newFood.setState(foodState);
};

var checkRing = function(newState) {
    var ringFreq = lot.getRingFreq(newState.mass);
    if (new Date() - newState.lastRing > ringFreq && !newState.ring) {
        newState.ring = true;
        newState.lastRing = new Date();
        if (!newState.canDash) {
            newState.canDash = true;
        }
    }
    if (new Date() - newState.lastRing > cfg.ringTime && newState.ring) {
        newState.ring = false;
        newState.lastRing = new Date();
    }
};


exports.getNewShootState = function(shoot, deltaTime) {
    var newState = {},
        state = shoot.state;

    newState.x = state.x;
    newState.y = state.y;
    newState.mass = state.mass;
    newState.lifeTime = state.lifeTime + deltaTime;

    newState.ring = state.ring;

    if (!newState.ring && newState.lifeTime > cfg.dashTime) {
        newState.ring = true;
    }
    if (newState.lifeTime > cfg.dashTime + cfg.shootTime) {
        return false;
    }
    return newState;
};

/**
 * Prediction
 * if food.referrer is undefined: random circular moving
 * else: move the food towards referrer with movingTime
 *
 * @param  {Food} food
 * @param  {int} deltaTime
 * @return {booleanOrObject}    false if Food is eaten
 */
exports.getNewFoodState = function(food, deltaTime) {
    var newState = {},
        state = food.state;
    newState.xReal = state.xReal;
    newState.yReal = state.yReal;
    newState.angle = state.angle;
    newState.vr = state.vr;
    newState.movingTime = state.movingTime;


    if (food.referrer === undefined) {
        newState.angle = (state.angle + newState.vr * cfg.foodRotationSpeed * deltaTime) % (2 * Math.PI);
        newState.x = state.xReal + cfg.foodRotationRadius * Math.cos(state.angle);
        newState.y = state.yReal + cfg.foodRotationRadius * Math.sin(state.angle);
    } else {
        var referrerState = food.referrer.state;

        newState.movingTime = state.movingTime + deltaTime;

        var distX = referrerState.x - state.x;
        var distY = referrerState.y - state.y;

        newState.x = state.x + distX * newState.movingTime / cfg.foodMovingTime;
        newState.y = state.y + distY * newState.movingTime / cfg.foodMovingTime;
        if (lot.inCircle(newState.x, newState.y, referrerState.x, referrerState.y) < cfg.foodEatenHitbox) {
            return false;
        }
    }


    return newState;
};

//Client: oP oE
/**
 * compute interpolated Player state
 * @param  {object} previousState
 * @param  {object} targetState
 * @param  {float} interpolationFactor
 * @return {object}                     interpolatedState
 */
exports.getInterpolatedEntityState = function(previousState, targetState, interpolationFactor) {
    var interpolatedState = {};
    interpolatedState.x = previousState.x + interpolationFactor * (targetState.x - previousState.x);
    interpolatedState.y = previousState.y + interpolationFactor * (targetState.y - previousState.y);
    interpolatedState.vx = targetState.vx;
    // if (targetState.vy - previousState.vy < 0) {
    //     interpolatedState.vy = targetState.vy;
    // } else {
    // }
    interpolatedState.vy = previousState.vy + interpolationFactor * (targetState.vy - previousState.vy);
    interpolatedState.mass = Math.round(previousState.mass + interpolationFactor * (targetState.mass - previousState.mass));
    interpolatedState.ring = targetState.ring;
    interpolatedState.dashing = targetState.dashing;

    return interpolatedState;
};
