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
    scaleMassFactor: 0.001,
    
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
    scopeInitX: 1280, //1280 * 0.7,
    scopeInitY: 720, //720 * 0.7,
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
    mapScale: 0.65,
    tunnelHeight: 300,
    
    //Player
    playerNameMaxSize: 15,
    playerImmunityTime: 10000,
    playerVx: 152,
    playerVy: 240,
    playerGravity: 825 * 0.8,
    playerMinMassDash: 0,
    playerInitMass: 0, //debug
    selfRadiusInitSize: 25,
    selfRadiusFactor: 0.16,
    
    // playerInitSize: 30, //init size sprite/hitbox
    playerSpriteInitSize: 60, //init size sprite/hitbox
    playerSpriteFactor: 0.8,
    debugSelfHitbox: false,
    
    
    dashSpeed: 800,
    dashMassLoss: 1,
    dashTime: 500,
    //#sample of dash texture
    dashTxtSize: 4,
    
    shootInitSize: 64,
    shootTime: 1000,
    
    //Foods - server, shared, client
    foodSpawnAmount: 500, //spawn amount for each click
    foodInsideProportion: 0.5,
    foodMasses: [1, 2, 3, 4, 12, 13], //random spawning masses
     
    foodHitbox: 20, //radius - food eating
    foodInitSize: 10,
    foodFactor: 5.6,
    
    foodSpriteInitSize: 6, //sprite
    foodSpriteFactor: 15, //sprite
    foodEatenHitbox: 8, //radius - food eaten (not mass dependent)
    foodMovingTime: 1000, //attracting maximal time (speed)
    foodRotationSpeed: 0.0035, //idle rotation speed
    foodRotationRadius: 8, //idle rotation radius 
    debugFood: false, //not used
    debugFoodHitbox: false,
    
    gradColors: [
        0xBAFF74, //0 green
        0x6780FF, //1 light blue
        0xB9FFFF, //2 cyan
        0xFFA42B, //3 orange
        0xB87FFF, //4 purple
        0xFF9090, //5 crusta
        0xFF5252, //6 POMEGRANATE
        0xFF71E8, //7 pink
        0xFCE966 //8 yellow
    ],
    // 0xffcdd2; //nop
    // 0xFF83B8; //nop?
    // 0xBF55FF; //nop?
    
    //Images
    //playerImage: '/client/img/planet.png',
    // playerSet: '/client/img/flappy.json',
    playerSet: '/client/img/grumpy.json',
    fireballSet: '/client/img/fireball.json',
    ringImg: '/client/img/firewater.png',
    shootImg: '/client/img/bullet.png',
    foodImg: '/client/img/v9.png',
    // mapImg: '/client/img/clouds.jpg',
    // mapImg: '/client/img/Background Black 512.jpg',
    mapImg: '/client/img/black.jpg',
    // mapImg: '/client/img/Background Transparency.png',
    // mapImg: '/client/img/bggray.jpg',
    // mapImg: '/client/img/wormax.png',
    // bgImg: '/client/img/bgred.jpg',
    bgImg: '/client/img/wormax.png',
    // bgImg: '/client/img/bgflowers.jpg',
    
    
    spectatorInitState: {
        x: 0,
        y: 0,
        mass: 0,
    },
    
    textOpt: {
        fontFamily: 'raleway',
        fill: '#ffffff',
        stroke: '#000000',
    },
};
