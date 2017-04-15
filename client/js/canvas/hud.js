//temporary
const Fps = require('../../../shared/fps'),
    cfg = require('../../../shared/config');


export default class Hud {
    constructor(cv) {
        this.cv = cv;
        this.canvas = cv.canvas;
    }
    
    preloadHud() {
        //we don't apply scale on HUD (but we do on stage): no blur
        this.container = new PIXI.Container();

        //Board
        // const board = document.getElementById('boardDiv');
        // const leaderboard = document.getElementById('leaderboard');
        const num = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
        this.entries = [];
        for (let i = 0; i < 10; i++) {
            this.entries.push(document.getElementById(num[i]));
        }
        
        //FPS
        this.fps = new Fps();
        this.fpsText = new PIXI.Text('', cfg.textOpt);
        this.container.addChild(this.fpsText);
        setInterval(() => {
            this.fpsText.text = 'Fps: ' + this.fps.getFps();
        }, 1000);
        
        //Mass
        this.score = new PIXI.Text('', cfg.textOpt);
        this.container.addChild(this.score);
        
        //x, y
        this.x = new PIXI.Text('', cfg.textOpt);
        this.container.addChild(this.x);
        this.y = new PIXI.Text('', cfg.textOpt);
        this.container.addChild(this.y);
        
        //Minimap
        this.minimap = new PIXI.Graphics();
        this.container.addChild(this.minimap);
        this.miniself = new PIXI.Graphics();
        this.container.addChild(this.miniself);
        
        this.container.visible = false;
    }

    //DOM
    drawBoard(board) {
        const len = board.length;
        for (let i = 0; i < len; i++) {
            this.entries[i].textContent = (i + 1) + '. ' + board[i];
        }
        
        if (len < 10) {
            for (let i = len; i < 10; i++) {
                this.entries[i].textContent = '';
            }
        }
    }
    
    drawHud(selfState) {
        //Mass if modif
        if (this.score.text !== 'Mass : ' + selfState.mass) {
            this.score.text = 'Mass : ' + selfState.mass;
        }
        //x,y
        this.x.text = 'x: ' + Math.round(selfState.x);
        this.y.text = 'y: ' + Math.round(selfState.y);
        
        //minimap
        const miniX = this.canvas.width + (selfState.x * cfg.minimapRad / cfg.midLimitRad - 60) * this.cv.cam.scale;
        const miniY = this.canvas.height + (selfState.y * cfg.minimapRad / cfg.midLimitRad - 60) * this.cv.cam.scale;
        this.miniself.clear();
        this.miniself.beginFill(0x000000, 0.5);
        this.miniself.drawCircle(miniX, miniY, cfg.miniselfRad * this.cv.cam.scale);
    }
}