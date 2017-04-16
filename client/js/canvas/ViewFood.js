const lot = require('../../../shared/lot'),
cfg = require('../../../shared/config');



export default class ViewFood {
    constructor(cv) {
        this.cv = cv;
        this.canvas = cv.canvas;
    }
    
    drawFood(food, selfState) {
        if (!food.sprite) {
            //TODO: color food + size
            //NOTE: texture careful!
            // const texture = Math.round(Math.random() * (cfg.foodPaletteSize - 1));
            // food.sprite = new PIXI.Sprite(this.cv.txt.foodTxtList[food.mass]);
            food.sprite = new PIXI.Sprite(this.cv.txt.foodTxt);
            food.sprite.blendMode = PIXI.BLEND_MODES.ADD;
            //NOTE: tint white for color!
            const i = lot.randomIntFromInterval(0, cfg.gradColors.length - 1);
            food.sprite.tint = cfg.gradColors[i];
            
            food.sprite.anchor.set(0.5);
            food.sprite.alpha = 0;
            food.sprite.displayGroup = this.cv.foodLayer;
            this.cv.stage.addChild(food.sprite);

            food.spriteLight = new PIXI.Sprite(this.cv.txt.foodLightTxt);
            food.spriteLight.blendMode = PIXI.BLEND_MODES.ADD;
            food.spriteLight.tint = cfg.gradColors[i];

            food.spriteLight.anchor.set(0.5);
            // food.spriteLight.alpha = 0;
            food.spriteLight.displayGroup = this.cv.foodLayer;
            food.spriteLight.scaleLight = 0; //
            
            this.cv.stage.addChild(food.spriteLight);
        }
        
        const x = food.state.x - selfState.x + this.canvas.width / 2;
        const y = food.state.y - selfState.y + this.canvas.height / 2;
        food.sprite.position.x = x;
        food.sprite.position.y = y;
        food.spriteLight.position.x = x;
        food.spriteLight.position.y = y;
        
        let size = lot.getFoodSpriteRadius(food.mass);
        // let size = 50 + 4 * food.mass;
        let newScale = 1;
        
        //spawn
        if (food.sprite.alpha < 1) {
            food.sprite.alpha += 0.05;
            food.sprite.alpha = Math.round(food.sprite.alpha * 100) / 100;
            newScale = food.sprite.alpha; 
        }
        
        if (food.spriteLight.scaleLight >= 1.2) {
            food.spriteLight.factor = -cfg.foodLightFactor;
        }
        if (food.spriteLight.scaleLight <= 0.4) {
            food.spriteLight.factor = cfg.foodLightFactor;
        }
        food.spriteLight.scaleLight += food.spriteLight.factor;
        food.spriteLight.scaleLight = Math.round(food.spriteLight.scaleLight * 100) / 100;

        //eaten
        if (food.referrer) {
            const referrerState = food.referrer.state;
            const dist = lot.distEucl(referrerState.x, referrerState.y, food.state.x, food.state.y);
            newScale = 1 - ((cfg.foodHitbox - cfg.foodEatenHitbox) / (2 * dist));
            // food.sprite.alpha = newScale;
            if (newScale < 0) newScale = 0;
            // console.log(newScale);
            // food.sprite.scale.set(newScale / 8);
        }
        
        size *= newScale;
        food.sprite.width = size;
        food.sprite.height = size;
        food.spriteLight.width = size * food.spriteLight.scaleLight;
        food.spriteLight.height = size * food.spriteLight.scaleLight;
        
        if (cfg.debugFoodHitbox) {
            const sizeHitbox = lot.getFoodRadius(food.mass);
            this.cv.debug.lineStyle(1, 0xFF0000);
            this.cv.debug.drawCircle(food.state.xReal - selfState.x + this.canvas.width / 2, food.state.yReal - selfState.y + this.canvas.height / 2, sizeHitbox);
            // this.cv.debug.drawCircle(x, y, cfg.foodEatenHitbox);
        }
    }
}