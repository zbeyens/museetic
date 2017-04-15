const cfg = require('../../../shared/config');


export default class ViewMap {
    constructor(cv) {
        this.cv = cv;
        this.canvas = cv.canvas;
    }
    
    preloadSprites() {
        this.map = new PIXI.extras.TilingSprite(this.cv.txt.mapTxt, cfg.mapSize, cfg.mapSize);
        this.map.displayGroup = this.cv.limitLayer;
        this.cv.stage.addChild(this.map);

        this.bg = new PIXI.extras.TilingSprite(this.cv.txt.bgTxt, cfg.mapSize, cfg.mapSize);
        // this.bg = new PIXI.Sprite(this.bgTexture);
        this.bg.displayGroup = this.cv.limitLayer;
        this.cv.stage.addChild(this.bg);

        //Limit
        this.midLimit = new PIXI.Sprite(this.cv.txt.midLimitTxt);
        this.midLimit.displayGroup = this.cv.limitLayer;
        this.cv.stage.addChild(this.midLimit);
        this.endLimit = new PIXI.Sprite(this.cv.txt.endLimitTxt);
        this.endLimit.displayGroup = this.cv.limitLayer;
        this.cv.stage.addChild(this.endLimit);

        //Tunnel
        this.tunnel = new PIXI.Graphics();
        this.tunnel.displayGroup = this.tunnelLayer;
        this.cv.stage.addChild(this.tunnel);
        
        //Debug layer
        this.cv.debug = new PIXI.Graphics();
        this.cv.debug.displayGroup = this.cv.tunnelLayer;
        this.cv.stage.addChild(this.cv.debug);
    }
    
    //Stage
    drawMap(selfState) {
        //the middle of the canvas - selfPos
        //i.e. if self go down, the map go up
        const x = this.canvas.width / 2 - selfState.x;
        const y = this.canvas.height / 2 - selfState.y;
        //origin at the center of the map
        this.map.anchor.set(0.5);
        this.map.position.set(x, y);
        this.map.scale.set(cfg.mapScale);
        this.map.alpha = 1;
        // this.map.tint = 0xb00000;
        // this.map.tint = 0xa144ff;
        // this.map.tint = 0x008705;
        // this.map.tint = 0x00b2ff;
        
        this.map.tint = 0x006EC7;
        
        this.bg.anchor.set(0.5);
        this.bg.position.set(x, y);
        this.bg.scale.set(0);
        this.bg.visible = false;


        //LIMITS
        const angle = Math.atan2(selfState.y, selfState.x);
        this.midLimit.position.x = x + cfg.midLimitOffset * Math.sqrt(2) * Math.cos(angle);
        this.midLimit.position.y = y + cfg.midLimitOffset * Math.sqrt(2) * Math.sin(angle);
        this.midLimit.rotation = -Math.PI / 4 + angle;

        this.endLimit.position.x = x + cfg.endLimitOffset * Math.sqrt(2) * Math.cos(angle);
        this.endLimit.position.y = y + cfg.endLimitOffset * Math.sqrt(2) * Math.sin(angle);
        this.endLimit.rotation = -Math.PI / 4 + angle;


        //TUNNELS
        this.tunnel.clear();
        this.tunnel.beginFill(0x00FF00, 0.5);
        if (selfState.x < 0) { //
            this.tunnel.drawRect(x - (cfg.midLimitRad + cfg.midLimitStroke), y - cfg.tunnelHeight / 2, cfg.midLimitStroke, cfg.tunnelHeight);
        } else {
            this.tunnel.drawRect(x + cfg.midLimitRad, y - cfg.tunnelHeight / 2, cfg.midLimitStroke, cfg.tunnelHeight);
        }
        
        
        //DEBUG
        this.cv.debug.clear();

        if (cfg.debugTileSize) {
            this.cv.debug.lineStyle(3, 0xFF0000);
            const width = Math.floor(cfg.endLimitRad / cfg.tileAmountX);
            const height = Math.floor(cfg.endLimitRad / cfg.tileAmountY);
            this.cv.debug.drawRect(x, y, width, height);
            // const X = Math.floor(cfg.tileAmountX * (selfState.x + cfg.endLimitRad) / (2 * cfg.endLimitRad));
            // const Y = Math.floor(cfg.tileAmountY * (selfState.y + cfg.endLimitRad) / (2 * cfg.endLimitRad));
            // const xTile = this.canvas.width / 2 - (X - cfg.tileAmountX / 2) * cfg.endLimitRad / cfg.tileAmountX;
            // const yTile = this.canvas.height / 2 - (Y - cfg.tileAmountY / 2) * cfg.endLimitRad / cfg.tileAmountY;
            // this.cv.debug.drawRect(xTile, yTile, width, height);
        }
    }
} 