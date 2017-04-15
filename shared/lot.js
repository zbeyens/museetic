var cfg = require('./config');

exports.getScaleMass = function(mass) {
    return 1 - Math.sqrt(mass) * cfg.scaleMassFactor;
};

exports.getRingRadius = function(mass) {
    return cfg.ringInitSize + Math.sqrt(mass) * cfg.ringFactor;
};

exports.getFoodRadius = function(mass) {
    return cfg.foodInitSize + Math.sqrt(mass) * cfg.foodFactor;
};

exports.getFoodSpriteRadius = function(mass) {
    return cfg.foodSpriteInitSize + Math.sqrt(mass) * cfg.foodSpriteFactor;
};

//sprite
exports.getBallRadius = function(mass) {
    return cfg.ballInitSize + Math.sqrt(mass) * cfg.ballFactor;
};
//core
exports.getBallSize = function(mass) {
    return cfg.ballSpriteInitSize + Math.sqrt(mass) * cfg.ballSpriteFactor;
};

exports.getBallPos = function(xc, yc, radius, angle) {
    var x = xc + radius * Math.cos(angle);
    var y = yc + radius * Math.sin(angle);
    var pos = {
        x: x,
        y: y,
    };
    return pos;
};
//sprite
exports.getRingSize = function(mass) {
    return cfg.ringInitSize + Math.sqrt(mass) * cfg.ringFactor;
};

exports.getRingMin = function(mass) {
    return cfg.ringMinInitSize + Math.sqrt(mass) * cfg.ringMinFactor;
};

exports.getRingMax = function(mass) {
    return cfg.ringMaxInitSize + Math.sqrt(mass) * cfg.ringMaxFactor;
};

exports.getRingFreq = function(mass) {
    return cfg.ringFreqInit - Math.sqrt(mass) * cfg.ringFreqFactor;
};

exports.getSelfRadius = function(mass) {
    return cfg.selfRadiusInitSize + Math.sqrt(mass) * cfg.selfRadiusFactor;
};

exports.getPlayerSpriteRadius = function(mass) {
    return cfg.playerSpriteInitSize + Math.sqrt(mass) * cfg.playerSpriteFactor;
};

exports.getScope = function(playerScope, checkMass) {
    return {
        maxScopeW: playerScope.maxScopeWInit + this.getRingMax(checkMass),
        maxScopeH: playerScope.maxScopeHInit + this.getRingMax(checkMass),
        minScopeW: playerScope.minScopeWInit + this.getRingMax(checkMass),
        minScopeH: playerScope.minScopeHInit + this.getRingMax(checkMass),
    };
};

exports.getRandomPos = function(midBegin, midEnd, max) {
    var randomRadius,
        randomZone = Math.random();

    if (randomZone < cfg.foodInsideProportion) {
        randomRadius = exports.randomIntFromInterval(0, Math.pow(midBegin, 2));
    } else {
        randomRadius = exports.randomIntFromInterval(Math.pow(midEnd, 2), Math.pow(max, 2));
    }

    var angle = Math.random() * Math.PI * 2;

    return {
        x: Math.cos(angle) * Math.sqrt(randomRadius),
        y: Math.sin(angle) * Math.sqrt(randomRadius),
    };
};

exports.randomIntFromInterval = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

exports.inRect = function(x, y, xc, yr, width, height) {
    if (xc - width / 2 <= x && x <= xc + width / 2 && yr - height / 2 <= y && y <= yr + height / 2) {
        return true;
    } else {
        return false;
    }
};

exports.distEucl = function(xi, yi, xf, yf) {
    return Math.sqrt(Math.pow(xf - xi, 2) + Math.pow(yf - yi, 2));
};

exports.idxOf = function(array, attr, value) {
    var idx = -1;
    for (var i = 0; i < array.length; i++) {
        if (array[i][attr] === value) {
            idx = i;
            break;
        }
    }
    return idx;
};

exports.abs = function(number) {
    if (number >= 0) {
        return number;
    } else {
        return -number;
    }
};

exports.round = function(prec, float) {
    var mul = Math.pow(10, prec);
    return Math.round(float * mul) / mul;
};

exports.sizeObject = function(object) {
    var objectList = [];
    var stack = [object];
    var bytes = 0;

    while (stack.length) {
        var value = stack.pop();

        if (typeof value === 'boolean') {
            bytes += 4;
        } else if (typeof value === 'string') {
            bytes += value.length * 2;
        } else if (typeof value === 'number') {
            bytes += 8;
        } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
            objectList.push(value);

            for (var i in value) {
                stack.push(value[i]);
            }
        }
    }
    return bytes;
};

exports.getStyle = function(factor, scale) {
    return {
        fontFamily: 'raleway',
        fill: '#ffffff',
        stroke: '#000000',
        fontSize: Math.floor(factor * scale) + 'px',
        strokeThickness: (2 * scale),
    };
};