const lot = require('../../../shared/lot'),
cfg = require('../../../shared/config');



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
            ball.sprite.alpha = 0;
            ball.sprite.displayGroup = this.cv.playerLayer;
            this.cv.stage.addChild(ball.sprite);
        }

        //NOTE: texture size careful!
        const size = lot.getBallSpriteRadius(ball.state.mass);

        // const x = ball.state.x - selfState.x + this.canvas.width / 2;
        const x = ball.state.x - selfState.x + this.canvas.width / 2;
        const y = ball.state.y - selfState.y + this.canvas.height / 2;
        ball.sprite.position.set(x, y);
        ball.sprite.rotation = ball.state.angle + Math.PI / 2;

        let newScale = 1;
        if (ball.sprite.alpha < 1) {
            ball.sprite.alpha += 0.05;
            ball.sprite.alpha = Math.round(ball.sprite.alpha * 100) / 100;
            newScale = ball.sprite.alpha;
        }
        
        ball.sprite.width = size * newScale;
        ball.sprite.height = size * newScale;
        
        if (cfg.debugBall) {
            const sizeHitbox = lot.getBallRadius(ball.state.mass);
            this.cv.debug.lineStyle(2, 0xFF0000);
            this.cv.debug.drawCircle(x, y, sizeHitbox);
        }
    }
}