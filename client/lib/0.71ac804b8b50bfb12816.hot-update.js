webpackHotUpdate(0,{

/***/ 5:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var cfg = __webpack_require__(6);

	exports.getScaleMass = function (mass) {
	    return 1 - Math.sqrt(mass) * 0.005;
	};

	exports.getPlayerSize = function (mass) {
	    return cfg.playerInitSize + Math.sqrt(mass) * 0.8;
	};

	exports.getRingSize = function (mass) {
	    return cfg.ringInitSize + Math.sqrt(mass) * 12;
	};

	exports.getRingMin = function (mass) {
	    return 136 + Math.sqrt(mass) * 3.6;
	};

	exports.getRingMax = function (mass) {
	    return 151 + Math.sqrt(mass) * 4.1;
	};

	exports.getRingFreq = function (mass) {
	    return 2000 - Math.sqrt(mass) * 20;
	};

	exports.getSelfScope = function (mass) {
	    return 20 + Math.sqrt(mass) * 0.15;
	};

	exports.getScope = function (playerScope, checkMass) {
	    return {
	        maxScopeW: playerScope.maxScopeWInit + this.getRingMax(checkMass),
	        maxScopeH: playerScope.maxScopeHInit + this.getRingMax(checkMass),
	        minScopeW: playerScope.minScopeWInit + this.getRingMax(checkMass),
	        minScopeH: playerScope.minScopeHInit + this.getRingMax(checkMass)
	    };
	};

	exports.getRandomPos = function (midBegin, midEnd, max) {
	    var randomRadius,
	        randomZone = Math.random();

	    if (randomZone < 0.5) {
	        randomRadius = Math.floor(Math.random() * (1 + midBegin));
	    } else {
	        randomRadius = Math.floor(Math.random() * (1 + max - midEnd)) + midEnd;
	    }

	    var angle = Math.random() * Math.PI * 2;

	    return {
	        x: Math.cos(angle) * randomRadius,
	        y: Math.sin(angle) * randomRadius
	    };
	};

	exports.inRect = function (x, y, xc, yr, width, height) {
	    if (xc - width / 2 <= x && x <= xc + width / 2 && yr - height / 2 <= y && y <= yr + height / 2) {
	        return true;
	    } else {
	        return false;
	    }
	};

	exports.inCircle = function (xi, yi, xf, yf) {
	    return Math.sqrt(Math.pow(xf - xi, 2) + Math.pow(yf - yi, 2));
	};

	exports.idxOf = function (array, attr, value) {
	    var idx = -1;
	    for (var i = 0; i < array.length; i++) {
	        if (array[i][attr] === value) {
	            idx = i;
	            break;
	        }
	    }
	    return idx;
	};

	exports.getDeltaTs = function (obj, attr) {
	    var now = new Date();
	    var physicsDelta = now - obj[attr];
	    obj[attr] = now;
	    return physicsDelta;
	};

	exports.abs = function (number) {
	    if (number >= 0) {
	        return number;
	    } else {
	        return -number;
	    }
	};

	exports.sizeObject = function (object) {
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
	        } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && objectList.indexOf(value) === -1) {
	            objectList.push(value);

	            for (var i in value) {
	                stack.push(value[i]);
	            }
	        }
	    }
	    return bytes;
	};

/***/ }

})