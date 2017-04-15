const lot = require('../../../shared/lot'),
cfg = require('../../../shared/config');



export default class ViewShoot {
    constructor(cv) {
        this.cv = cv;
        this.canvas = cv.canvas;
    }
    
    drawShoot(shoot, selfState) {
        if (!shoot.sprite) {
            shoot.sprite = new PIXI.Sprite(this.cv.txt.ringTxt);
            shoot.sprite.anchor.set(0.5);
            shoot.sprite.displayGroup = this.cv.playerLayer;
            this.cv.stage.addChild(shoot.sprite);
        }

        const size = lot.getRingSize(shoot.state.mass);
        let sizeFactor = shoot.state.lifeTime / cfg.dashTime;
        if (sizeFactor > 1) {
            sizeFactor = 1;
        }

        shoot.sprite.width = sizeFactor * size;
        shoot.sprite.height = sizeFactor * size;
        // shoot.sprite.alpha = sizeFactor;
        shoot.sprite.position.x = shoot.state.x - selfState.x + this.canvas.width / 2;
        shoot.sprite.position.y = shoot.state.y - selfState.y + this.canvas.height / 2;
        //
        // shoot.sprite.visible = true;
    }
}