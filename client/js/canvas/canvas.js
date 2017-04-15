import Camera from './camera';
import Hud from './hud';
import Textures from './textures';
import ViewMap from './ViewMap';
import ViewPlayer from './ViewPlayer';
import ViewBall from './ViewBall';
import ViewFood from './ViewFood';
import ViewShoot from './ViewShoot';

const cfg = require('../../../shared/config');
    

export default class Canvas {
    constructor() {
        this.canvas = document.getElementById("ctx");
        this.assetsLoaded = false;
        this.txt = new Textures(this);
        this.hud = new Hud(this);
        this.cam = new Camera(this);
        this.vmap = new ViewMap(this);
        this.vplayer = new ViewPlayer(this);
        this.vball = new ViewBall(this);
        this.vfood = new ViewFood(this);
        this.vshoot = new ViewShoot(this);
        
        this.preload();
        
        window.addEventListener('resize', (e) => {
            this.cam.resizeCamera();
        });
        this.cam.resizeCamera();
    }
    
    preload() {
        this.renderer = new PIXI.autoDetectRenderer(cfg.scopeInitX, cfg.scopeInitY, {
            view: this.canvas
        });
        //PIXI.RESOLUTION = window.devicePixelRatio;
        this.renderer.clearBeforeRender = false;

        this.preloadStage();
        this.txt.preloadTextures();
        this.hud.preloadHud();
    }

    preloadStage() {
        this.stage = new PIXI.Container();
        this.stage.displayList = new PIXI.DisplayList();
        this.mapLayer = new PIXI.DisplayGroup(1, false);
        this.limitLayer = new PIXI.DisplayGroup(2, false);
        this.tunnelLayer = new PIXI.DisplayGroup(3, false);
        this.foodLayer = new PIXI.DisplayGroup(4, false);
        this.playerLayer = new PIXI.DisplayGroup(5, false);
        // this.textLayer = new PIXI.DisplayGroup(4, false);
    }

    onTexturesLoaded() {
        this.vmap.preloadSprites();
        //NOTE needed ?
        this.vmap.drawMap({
            x: 0,
            y: 0,
        });
        this.assetsLoaded = true;

        //start DOM animation
        const signPanelDiv = document.getElementById('signPanelDiv');
        signPanelDiv.style.display = 'block';
        this.canvas.style.display = 'block';
    }

    render() {
        this.renderer.render(this.stage);
        this.renderer.render(this.hud.container);
        // this.renderer.render(this.foodContainer);
    }
    

    removeSprites(removedPlayers, removedFoods, removedShoots) {
        // sprite.destroy(); - will destroy sprite, leaving PIXI.Texture and PIXI.BaseTexture untouched
        // sprite.destroy(true); - will destroy sprite and PIXI.Texture; PIXI.BaseTexture remains untouched
        // sprite.destroy(true, true); - will destroy sprite, PIXI.Texture and PIXI.BaseTexture
        for (let i = removedPlayers.length; i--;) {
            const removedBalls = removedPlayers[i].getBallController().getEntities();
            if (removedPlayers[i].sprite) {
                this.stage.removeChild(removedPlayers[i].sprite);
                removedPlayers[i].sprite.destroy();
            }
            for (let j = removedBalls.length; j--;) {
                if (removedBalls[j].sprite) {
                    this.stage.removeChild(removedBalls[j].sprite);
                    removedBalls[j].sprite.destroy();
                }
            }
            if (removedPlayers[i].spriteRing) {
                this.stage.removeChild(removedPlayers[i].spriteRing);
                removedPlayers[i].spriteRing.destroy();
            }
            if (removedPlayers[i].spriteDash) {
                this.stage.removeChild(removedPlayers[i].spriteDash);
                removedPlayers[i].spriteDash.destroy();
            }
            if (removedPlayers[i].graphics) {
                this.stage.removeChild(removedPlayers[i].graphics);
                removedPlayers[i].graphics.destroy(true);
            }
            if (removedPlayers[i].text) {
                this.hud.container.removeChild(removedPlayers[i].text);
                removedPlayers[i].text.destroy(true);
            }
        }
        for (let i = removedFoods.length; i--;) {
            if (removedFoods[i].sprite) {
                this.stage.removeChild(removedFoods[i].sprite);
                removedFoods[i].sprite.destroy();
            }
        }
        for (let i = removedShoots.length; i--;) {
            if (removedShoots[i].sprite) {
                this.stage.removeChild(removedShoots[i].sprite);
                removedShoots[i].sprite.destroy();
            }
        }
    }
}
