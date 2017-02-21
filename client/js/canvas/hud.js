//temporary
var Fps = require('../../../shared/fps');

exports = module.exports = Hud;

function Hud() {}

Hud.prototype = {
    preloadHud: function() {
        //we don't apply scale on HUD (but we do on stage): no blur
        this.hud = new PIXI.Container();

        //Board
        this.board = document.getElementById('boardDiv');
        this.leaderboard = document.getElementById('leaderboard');
        this.entry = document.getElementById('entry');
        var num = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
        this.entries = [];
        for (var i = 0; i < 10; i++) {
            this.entries.push(document.getElementById(num[i]));
        }

        this.textOpt = {
            fontFamily: 'raleway',
            fill: '#ffffff',
            stroke: '#000000',
        };

        //FPS
        this.fps = new Fps();
        this.fpsText = new PIXI.Text('', this.textOpt);
        this.hud.addChild(this.fpsText);
        setInterval(function() {
            this.fpsText.text = 'Fps: ' + this.fps.getFps();
        }.bind(this), 1000);

        //Mass
        this.score = new PIXI.Text('', this.textOpt);
        this.hud.addChild(this.score);

        //x, y
        this.x = new PIXI.Text('', this.textOpt);
        this.hud.addChild(this.x);
        this.y = new PIXI.Text('', this.textOpt);
        this.hud.addChild(this.y);

        //Minimap
        this.minimap = new PIXI.Graphics();
        this.hud.addChild(this.minimap);
        this.miniself = new PIXI.Graphics();
        this.hud.addChild(this.miniself);

        this.hud.visible = false;
    },

    drawHud: function(selfState) {
        //Mass if modif
        if (this.score.text != 'Mass : ' + selfState.mass) {
            this.score.text = 'Mass : ' + selfState.mass;
        }

        //x,y
        this.x.text = 'x: ' + Math.round(selfState.x);
        this.y.text = 'y: ' + Math.round(selfState.y);
    },
};
