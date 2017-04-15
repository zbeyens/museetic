const lot = require('../../../shared/lot');
// cfg = require('../../../shared/config');
    


export default class ViewBall {
    constructor(cv) {
        this.cv = cv;
        this.canvas = cv.canvas;
    }
    
    drawBall(ball, selfState) {
        if (!ball.sprite) {
            ball.sprite = new PIXI.extras.MovieClip(this.cv.txt.fireballTxtList);
            ball.sprite.animationSpeed = 0.2;
            ball.sprite.play();
            ball.sprite.anchor.set(0.5);
            //ball.sprite.alpha = 0;
            ball.sprite.displayGroup = this.cv.playerLayer;
            this.cv.stage.addChild(ball.sprite);
        }
        // if (!ball.sprite) {
        //     //TODO: color ball + size
        //     //NOTE: texture careful!
        //
        //     this.cv.stage.addChild(ball.sprite);
        // }
        const size = lot.getBallSize(ball.state.mass);
        ball.sprite.width = size;
        ball.sprite.height = size;
        const x = ball.state.x - selfState.x + this.canvas.width / 2;
        const y = ball.state.y - selfState.y + this.canvas.height / 2;
        ball.sprite.position.set(x, y);
        ball.sprite.rotation = ball.state.angle + Math.PI / 2;
        //
        // if (ball.sprite.alpha < 1) {
        //     ball.sprite.alpha += 0.05;
        //     ball.sprite.alpha = Math.round(ball.sprite.alpha * 100) / 100;
        //     ball.sprite.scale.set(ball.sprite.alpha);
        // }

        // if (cfg.debugFoodHitbox) {
        // this.tunnel.clear();
        this.cv.debug.beginFill(0xFF0000);
        // const radius = lot.getBallMass(ball.state.mass);
        // this.cv.debug.drawCircle(x, y, radius);
        this.cv.debug.beginFill(0xFF0000, 0);
        // this.cv.debug.drawCircle(x, y, cfg.foodEatenHitbox);
        // }
    }
}