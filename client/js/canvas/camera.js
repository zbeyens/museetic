var cfg = require('../../../shared/config'),
    lot = require('../../../shared/lot');

exports = module.exports = Camera;

function Camera() {
    this.scale = 1; //with zoom
    this.scaleMass = 1;
    this.zoom = 0;
    this.scaleTarget = 1;
    this.scaleCurrent = 1;
    // this.
}

Camera.prototype = {
    setScaleTarget: function(applySmooth) {
        this.scaleTarget = this.scale * this.scaleMass * Math.pow(cfg.zoomFactor, this.zoom);
        //TODO: smooth only zoom

        if (!applySmooth) {
            this.scaleCurrent = this.scaleTarget;
            this.resizeStage(this.scaleCurrent);
        }
    },

    smoothResize: function(deltaTime) {
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
    },

    //increase scale
    zoomIn: function(zoomIn) {
        for (var i = 0; i < zoomIn; i++) {
            var scaleTarget = this.scale * this.scaleMass * Math.pow(cfg.zoomFactor, this.zoom + 1);
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
    },

    //decrease scale
    zoomOut: function(zoomOut) {

        for (var i = 0; i < zoomOut; i++) {
            this.zoom -= 1;
            if (this.zoom < 0 && !cfg.debugZoom) {
                this.zoom = 0;
            }
        }

        this.setScaleTarget(true);
    },

    /**
     * called on window resize
     * @return {void}
     */
    resizeCamera: function() {
        this.resizeCanvas();
        this.resizeHud();
    },

    //modify this.scale and resize
    resizeCanvas: function() {
        //like agario
        var w = window.innerWidth * 1.25;
        var h = window.innerHeight * 1.25;
        // console.log(w);
        // console.log(h);
        this.canvas.width = w;
        this.canvas.height = h;
        this.renderer.resize(this.canvas.width, this.canvas.height);
        this.stage.pivot.x = this.canvas.width / 2;
        this.stage.pivot.y = this.canvas.height / 2;
        this.stage.position.x = this.canvas.width / 2;
        this.stage.position.y = this.canvas.height / 2;

        // 1600 / 1920 = 0.8333;
        // 500 / 1080 = 0.463;
        // to fill canvas will be 0.8333 * (1920,1080) = (1600,900) clipped top and bottom
        var scale = Math.max(w / cfg.scopeInitX, h / cfg.scopeInitY);

        //care of rounding...
        var canW = lot.round(2, scale * cfg.scopeInitX);
        var canH = lot.round(2, scale * cfg.scopeInitY);
        if (canW > w) {
            this.scale = window.innerHeight / cfg.scopeInitY;
        } else
        if (canH > h) {
            this.scale = window.innerWidth / cfg.scopeInitX;
        }

        //no smoothing
        this.setScaleTarget(false);
    },

    //modify this.scaleMass and resize
    resizeMass: function(mass) {
        this.scaleMass = lot.getScaleMass(mass);
        this.setScaleTarget(false);
    },

    resizeStage: function(scale) {
        this.stage.scale.set(scale);
    },

    resizeHud: function() {
        this.leaderboard.style.fontSize = (this.board.offsetWidth / 7) + "px";
        this.entry.style.fontSize = (this.board.offsetWidth / 11) + "px";

        var fpsTextX = 5 * this.scale,
            fpsTextY = 5 * this.scale,
            scoreX = 5 * this.scale,
            scoreY = this.canvas.height - 25 * this.scale,
            xX = 5 * this.scale,
            xY = 30 * this.scale,
            yX = 5 * this.scale,
            yY = 50 * this.scale,
            miniX = this.canvas.width - 60 * this.scale,
            miniY = this.canvas.height - 60 * this.scale;

        this.fpsText.position.set(fpsTextX, fpsTextY);
        this.score.position.set(scoreX, scoreY);
        this.x.position.set(xX, xY);
        this.y.position.set(yX, yY);

        var style = this.getStyle(20);
        this.fpsText.style = style;
        this.score.style = style;
        this.x.style = style;
        this.y.style = style;

        this.minimap.clear();
        this.minimap.beginFill(0xa8a8a8, 0.5);
        this.minimap.drawCircle(miniX, miniY, cfg.minimapRad * this.scale);
    },
};
