var cfg = require('../../../shared/config'),
    lot = require('../../../shared/lot');

exports = module.exports = Camera;

function Camera() {}

Camera.prototype = {
    resizeCamera: function() {
        this.resizeCanvas();
        this.resizeHud();
    },

    resizeCanvas: function() {
        //like agario
        var w = window.innerWidth * 1.25;
        var h = window.innerHeight * 1.25;
        // console.log(w);
        // console.log(h);
        this.canvas.width = w;
        this.canvas.height = h;
        this.renderer.resize(this.canvas.width, this.canvas.height);


        // 1600 / 1920 = 0.8333;
        // 500 / 1080 = 0.463;
        // to fill canvas will be 0.8333 * (1920,1080) = (1600,900) clipped top and bottom
        var scale = Math.max(w / cfg.scopeInitX, h / cfg.scopeInitY);

        var canW = (scale * cfg.scopeInitX);
        var canH = (scale * cfg.scopeInitY);
        if (canW > w) {
            this.scale = window.innerHeight / cfg.scopeInitY;
        } else
        if (canH > h) {
            this.scale = window.innerWidth / cfg.scopeInitX;
        }

        // console.log(this.scale);
        this.resizeContainer(this.stage, this.scale * this.scaleMass);
    },
    resizeContainer: function(container, scale) {
        container.scale.set(scale);
        container.position.set(this.canvas.width * (1 - scale) / 2, this.canvas.height * (1 - scale) / 2);
    },

    resizeMass: function(mass) {
        this.scaleMass = lot.getScaleMass(mass);
        this.resizeContainer(this.stage, this.scale * this.scaleMass);
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
