module.exports = {
    env: 'development',

    serverPort: process.env.PORT || 3000,
    // serverUrl: 'localhost',
    serverUrl: 'flapzd.herokuapp.com',
    serverMaxGamers: 10,
    serverMaxSameIp: 5,
    serverLagCompensation: 0,
    serverPacketMaxSize: 128, //OPTI: serverPacketMaxSize

    tickMain: 50, //main loop - times in ms
    tickBoard: 10, //update board - this * tickMain
    tickPhysics: 17, //update physics

    tickState: 50, //send state, each player
    tickScope: 8, //scope = this * tickState

    clientMaxUpdateBuffer: 120,
    clientInterpolationTime: 100,
    clientSmoothingFactor: 0.3,

    debug: false,
    debugMove: false,
    debugZoom: true, //to remove!
    debugTileSize: false,
    debugSelfScope: false,
    debugBorder: false,
    debugFood: false,
    debugFoodHitbox: false,
    debugSelfHitbox: false,
    debugRingHitbox: false,

    zoomFactor: 1.1,
    zoomScaleLimit: 2.5,

    /**
     * inactive_destroy = 5*60*1000;   //time in ms when to destroy inactive balls
     * inactive_check   = 10*1000;     //time in ms when to search inactive balls
     * spawn_interval   = 200;         //time in ms for respawn interval. 0 to disable (if your custom server don't have spawn problems)
     * spawn_attempts   = 25;          //how much attempts to spawn before give up
     */

    //balance size
    scaleMassFactor: 0.003,
    selfScopeInitSize: 10,
    selfScopeFactor: 0.16,
    playerInitSize: 50,
    playerFactor: 0.8,
    ballInitSize: 20,
    ballFactor: 0.5,
    ballSpriteInitSize: 100,
    ballSpriteFactor: 2,
    ringInitSize: 100,
    ringFactor: 2,
    ringMaxInitSize: 151,
    ringMaxFactor: 4.1,

    ballTreshold: 500,
    ballSpeed: 1.4,

    ringFreqInit: 2000,
    ringFreqFactor: 20,
    ringTime: 300,

    //Map 960x600
    scopeRatio: 16 / 9,
    scopeInitX: 896, //1280 * 0.7,
    scopeInitY: 504, //720 * 0.7,
    tileAmountX: 100,
    tileAmountY: 100,
    tileScopeAmountX: 17, //odd
    tileScopeAmountY: 11, //odd
    tileFoodRange: 5, //range check to eat foods

    minimapRad: 50,
    miniselfRad: 3,
    midLimitRad: 3000,
    midLimitStroke: 1600,
    midLimitOffset: 1400,
    endLimitRad: 10000,
    endLimitStroke: 1600,
    endLimitOffset: 6000,
    mapSize: 23200, //should be bigger to not see black
    tunnelHeight: 300,

    playerNameMaxSize: 15,
    playerImmunityTime: 10000,
    playerVx: 152,
    playerVy: 240,
    playerGravity: 825 * 0.8,
    playerMinMassDash: 0,
    //debug
    playerInitMass: 0,



    dashSpeed: 800,
    dashMassLoss: 1,
    dashTime: 500,
    //#sample of dash texture
    dashTxtSize: 4,

    shootInitSize: 64,
    shootTime: 1000,

    foodInitSize: 50, //to remove ?
    foodMass: 500,
    foodSpawnAmount: 500,
    foodInsideProportion: 0.5,
    foodMovingTime: 1000,
    foodRotationSpeed: 0.003,
    foodRotationRadius: 5,
    foodHitbox: 30,
    foodEatenHitbox: 8,


    //Images
    //playerImage: '/client/img/planet.png',
    playerSet: '/client/img/flappy.json',
    fireballSet: '/client/img/fireball.json',
    ringImg: '/client/img/firewater.png',
    shootImg: '/client/img/bullet.png',
    // mapImg: '/client/img/clouds.jpg',
    mapImg: '/client/img/slither.png',
    bgImg: '/client/img/norik.jpg',

    foodPaletteSize: 9,
    //rgb(242, 38, 19) POMEGRANATE
    foodColor0: [242, 38, 19],
    //rgb(255, 149, 0)
    foodColor1: [255, 149, 0],
    // rgb(255, 204, 0)
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
    foodColor8: [255, 144, 144],

    spectatorInitState: {
        x: 0,
        y: 0,
        mass: 0,
    },
};
