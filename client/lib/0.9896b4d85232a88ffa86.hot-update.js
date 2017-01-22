webpackHotUpdate(0,{

/***/ 8:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	module.exports = {
	    env: 'development',
	    debug: false,

	    serverPort: process.env.PORT || 5000,
	    // serverUrl: 'localhost',
	    serverUrl: location.origin,
	    serverPhysicsInterval: 60,
	    serverStateInterval: 20,
	    serverMaxGamers: 10,
	    serverMaxSameIp: 2,
	    serverLagCompensation: 0,

	    clientMaxUpdateBuffer: 120,
	    clientInterpolationTime: 100,
	    clientSmoothingFactor: 0.3,

	    //Map 960x600
	    tileAmountX: 100,
	    tileAmountY: 100,
	    tileScopeAmountX: 17,
	    tileScopeAmountY: 9,
	    scopeInitX: 1280,
	    scopeInitY: 720,
	    minimapRad: 50,
	    miniselfRad: 3,
	    midLimitRad: 3000,
	    midLimitStroke: 1600,
	    midLimitOffset: 1400,
	    endLimitRad: 10000,
	    endLimitStroke: 1600,
	    endLimitOffset: 6000,
	    mapSize: 23200,
	    tunnelHeight: 300,

	    playerInitSize: 50,
	    playerImmunityTime: 5000,
	    playerVx: 190,
	    playerVy: 300,
	    playerGravity: 825,
	    playerMinMassDash: 0,

	    ringInitSize: 450,
	    ringTime: 300,

	    dashSpeed: 800,
	    dashMassLoss: 1,
	    dashTime: 500,

	    shootInitSize: 64,
	    shootTime: 1000,

	    foodInitSize: 50,
	    foodSpawnAmount: 1000,
	    foodCollide: 10,
	    foodMovingTime: 1000,
	    foodRotationSpeed: 0.05,
	    foodRotationRadius: 5,
	    foodEatenRadius: 10,
	    foodV: 0.002,

	    //Image
	    //playerImage: '/client/img/planet.png',
	    playerImageR: '/client/img/flappyR.png',
	    playerImageL: '/client/img/flappyL1.png',
	    ringImage: '/client/img/firewater.png',
	    shootImage: '/client/img/bullet.png',
	    // mapImage: '/client/img/clouds.jpg',
	    mapImage: '/client/img/slither.png',
	    bgImage: '/client/img/norik.jpg',

	    foodPaletteSize: 9,
	    //rgb(242, 38, 19) POMEGRANATE
	    foodColor0: [242, 38, 19],
	    //rgb(255, 149, 0)
	    foodColor1: [255, 149, 0],
	    //rgb(255, 204, 0)
	    foodColor2b: [255, 204, 0],
	    //rgb(245, 215, 110) CREAM CAN
	    foodColor2: [245, 215, 110],
	    //rgb(76, 217, 100)
	    foodColor3: [76, 217, 100],
	    //rgb(128,255,128) green monokai
	    // foodColor3: [166, 226, 46],
	    //rgb(102, 217, 239) light blue monokai
	    foodColor4: [102, 217, 239],
	    //rgb(191, 85, 236) MEDIUM PURPLE
	    foodColor5: [191, 85, 236],
	    //rgb(88, 86, 214)
	    foodColor6: [88, 86, 214],
	    //rgb(255, 45, 85)
	    // foodColor7: [255, 45, 85],
	    //rgb(249, 38, 114) ORCHID
	    foodColor7: [249, 38, 114],
	    //rgb(255, 144, 144) crusta
	    foodColor8: [255, 144, 144]
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }

})