const cfg = require('../../../shared/config'),
    lot = require('../../../shared/lot');


export default class Camera {
    //called in Canvas
    constructor(cv) {
        this.cv = cv;
        this.scale = 1; //with zoom
        this.scaleMass = 1;
        this.zoom = 0;
        this.scaleTarget = 1;
        this.scaleCurrent = 1;
        
        this.resizeCamera();
    }

    setScaleTarget(applySmooth) {
        this.scaleTarget = this.scale * this.scaleMass * Math.pow(cfg.zoomFactor, this.zoom);
        //TODO: smooth only zoom
        
        if (!applySmooth) {
            this.scaleCurrent = this.scaleTarget;
            this.resizeStage(this.scaleCurrent);
        }
    }
    
    //called in Game
    smoothResize(deltaTime) {
        if (this.scaleTarget > this.scaleCurrent) {
            this.scaleCurrent += deltaTime * 0.0030;
            if (this.scaleCurrent > this.scaleTarget) {
                this.scaleCurrent = this.scaleTarget;
            }
            this.resizeStage(this.scaleCurrent);
        } else if (this.scaleTarget < this.scaleCurrent) {
            this.scaleCurrent -= deltaTime * 0.0030;
            if (this.scaleCurrent < this.scaleTarget) {
                this.scaleCurrent = this.scaleTarget;
            }
            this.resizeStage(this.scaleCurrent);
        }
    }
    
    //called in Game
    zoomIn(zoomIn) {
        for (let i = 0; i < zoomIn; i++) {
            const scaleTarget = this.scale * this.scaleMass * Math.pow(cfg.zoomFactor, this.zoom + 1);
            if (scaleTarget > cfg.zoomScaleLimit) {
                // this.zoom = Math.log(cfg.zoomScaleLimit / (this.scale * this.scaleMass)) /
                //     (cfg.zoomFactor * Math.log(cfg.zoomFactor));
                // console.log(this.zoom);
                break;
            } else {
                this.zoom += 1;
            }
        }
        this.setScaleTarget(true);
    }
    
    //called in Game
    zoomOut(zoomOut) {
        for (let i = 0; i < zoomOut; i++) {
            this.zoom -= 1;
            if (this.zoom < 0 && !cfg.debugZoom) {
                this.zoom = 0;
            }
        }
        
        this.setScaleTarget(true);
    }
    
    /**
    * called in Canvas on window resize
    * @return {void}
    */
    resizeCamera() {
        this.resizeCanvas();
        this.resizeHud();
    }
    
    //modify this.scale and resize
    resizeCanvas() {
        //like agario
        const w = window.innerWidth * 1.25;
        const h = window.innerHeight * 1.25;
        // console.log(w);
        // console.log(h);
        this.cv.canvas.width = w;
        this.cv.canvas.height = h;
        this.cv.renderer.resize(this.cv.canvas.width, this.cv.canvas.height);
        this.cv.stage.pivot.x = this.cv.canvas.width / 2;
        this.cv.stage.pivot.y = this.cv.canvas.height / 2;
        this.cv.stage.position.x = this.cv.canvas.width / 2;
        this.cv.stage.position.y = this.cv.canvas.height / 2;
        
        // 1600 / 1920 = 0.8333;
        // 500 / 1080 = 0.463;
        // to fill canvas will be 0.8333 * (1920,1080) = (1600,900) clipped top and bottom
        const scale = Math.max(w / cfg.scopeInitX, h / cfg.scopeInitY);
        
        //care of rounding...
        const canW = lot.round(2, scale * cfg.scopeInitX);
        const canH = lot.round(2, scale * cfg.scopeInitY);
        if (canW > w) {
            this.scale = window.innerHeight / cfg.scopeInitY;
        } else
        if (canH > h) {
            this.scale = window.innerWidth / cfg.scopeInitX;
        }
        //no smoothing
        this.setScaleTarget(false);
    }
    
    //modify this.scaleMass and resize
    resizeMass(mass) {
        this.scaleMass = lot.getScaleMass(mass);
        this.setScaleTarget(false);
    }
    
    resizeStage(scale) {
        this.cv.stage.scale.set(scale);
    }
    
    resizeHud() {
        const fpsTextX = 5 * this.scale,
        fpsTextY = 5 * this.scale,
        scoreX = 5 * this.scale,
        scoreY = this.cv.canvas.height - 25 * this.scale,
        xX = 5 * this.scale,
        xY = 30 * this.scale,
        yX = 5 * this.scale,
        yY = 50 * this.scale,
        miniX = this.cv.canvas.width - 60 * this.scale,
        miniY = this.cv.canvas.height - 60 * this.scale;
        
        this.cv.hud.fpsText.position.set(fpsTextX, fpsTextY);
        this.cv.hud.score.position.set(scoreX, scoreY);
        this.cv.hud.x.position.set(xX, xY);
        this.cv.hud.y.position.set(yX, yY);
        
        const style = lot.getStyle(20, this.scale);
        this.cv.hud.fpsText.style = style;
        this.cv.hud.score.style = style;
        this.cv.hud.x.style = style;
        this.cv.hud.y.style = style;
        
        this.cv.hud.minimap.clear();
        this.cv.hud.minimap.beginFill(0xa8a8a8, 0.5);
        this.cv.hud.minimap.drawCircle(miniX, miniY, cfg.minimapRad * this.scale);
    }
}