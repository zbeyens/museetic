const cfg = require('../../../shared/config');


export default class Textures {
    constructor(cv) {
        this.cv = cv;
    }
    
    /**
     * Pixi uses Texture cache to store and reference all the textures needed.
     * Texture = WebGL format of an image, to be processed by the GPU.
     * @return {[type]} [description]
     */
    preloadTextures() {
        this.loader = new PIXI.loaders.Loader();
        this.loader
            // Chainable `add` to enqueue a resource
            .add("ringTxt", cfg.ringImg)
            .add("mapTxt", cfg.mapImg)
            .add("bgTxt", cfg.bgImg)
            .add("foodTxt", cfg.foodImg)
            .add("foodLightTxt", cfg.foodLightImg)
            .add(cfg.playerSet)
            .add(cfg.fireballSet)

            .on("progress", this.onAssetsLoading.bind(this))
            .once("complete", this.onAssetsLoaded.bind(this))
            // The `load` method loads the queue of resources, and calls the
            // passed in callback called once all resources have loaded.
            .load();

        //.reset()
        //PIXI.TextureCache['assets/images/hud/hud_bench.png'].destroy(true);

        //mid limit
        const canMid = this.createBorderTexture(cfg.midLimitRad, cfg.midLimitStroke, cfg.midLimitOffset);
        this.midLimitTxt = new PIXI.Texture.fromCanvas(canMid);
        //end limit
        const canEnd = this.createBorderTexture(cfg.endLimitRad, cfg.endLimitStroke, cfg.endLimitOffset);
        this.endLimitTxt = new PIXI.Texture.fromCanvas(canEnd);

        // this.foodTxtList = {};
        // for (let i = 0; i < cfg.foodMasses.length; i++) {
        //     const canFood = this.createFoodTexture(cfg.foodMasses[i]);
        //     this.foodTxtList[cfg.foodMasses[i]] = new PIXI.Texture.fromCanvas(canFood);
        // }

        //TODO: dash color for each skin
        this.dashTxtList = [];
        for (let i = 0; i < cfg.dashTxtSize; i++) {
            const b = {
                x: 25,
                y: 25,
                rad: 25,
                r: 252,
                g: 233,
                b: 102,
            };
            const canDash = this.createDashTexture(i, b);
            this.dashTxtList.push(new PIXI.Texture.fromCanvas(canDash));
        }
        //dash textures: a-b-c-d-c-b
        //or play and rewind
        const rewind = this.dashTxtList.slice(1, -1);
        this.dashTxtList = this.dashTxtList.concat(rewind.reverse());
    }

    onAssetsLoading(loader, loadedResource) {
        console.log('Progress:', loader.progress + '%');
    }

    /**
     * use aliases
     * @return {void}
     */
    onAssetsLoaded() {
        const resources = this.loader.resources;
        // this.playerImgL.baseTexture.mipmap = false;
        // this.playerImgR.baseTexture.mipmap = false;
        // this.loader.resources.ringTxt.destroy(true);
        // PIXI.TextureCache['/client/img/bullet.png'].destroy(true);
        this.ringTxt = resources.ringTxt.texture;
        this.mapTxt = resources.mapTxt.texture;
        this.bgTxt = resources.bgTxt.texture;
        this.foodTxt = resources.foodTxt.texture;
        this.foodLightTxt = resources.foodLightTxt.texture;
        // console.log(PIXI.loader.resources);
        this.playerTxtList = [];
        // for (let i = 0; i < 3; i++) {
        //     this.playerTxtList.push(PIXI.Texture.fromFrame('flappy' + i + '.png'));
        for (let i = 1; i < 5; i++) {
            this.playerTxtList.push(PIXI.Texture.fromFrame('frame-' + i + '.png'));
        }

        this.fireballTxtList = [];
        for (let i = 0; i < 6; i++) {
            this.fireballTxtList.push(PIXI.Texture.fromFrame('fireball' + i + '.png'));
        }
        //Create a rectangle object that defines the position and
        //size of the sub-image you want to extract from the texture
        // const rectangle = new Rectangle(0, 0, 512, 512);
        //
        // const txt = resources.fireballTxtSet;
        // //Tell the texture to use that rectangular section
        // txt.frame = rectangle;
        // this.ballTxtList.push(new PIXI)

        this.cv.onTexturesLoaded();
    }

    /**
     * mid and end limit
     * @param  {float} limitRad    radius
     * @param  {float} limitStroke thickness
     * @param  {float} limitOffset negative position of the center
     * @return {canvas}            90 degrees circle of radius =
     *                                limitRad + limitStroke thickness
     */
    createBorderTexture(limitRad, limitStroke, limitOffset) {
        //can we decrease width/height according to scale ?
        const canSize = limitRad + limitStroke - limitOffset;
        const can = this.createCanvas(canSize, canSize);
        const ctx = can.getContext('2d');
        if (cfg.debugBorder) {
            ctx.strokeStyle = 'rgba(250, 255, 0, 0.7)';
            ctx.lineWidth = 5;
            ctx.strokeRect(0, 0, canSize, canSize);
        }
        ctx.beginPath();
        ctx.arc(-limitOffset, -limitOffset, limitRad + limitStroke / 2, 0, Math.PI / 2); //radius + lineWidth/2
        ctx.lineWidth = limitStroke;
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
        ctx.stroke();
        return can;
    }

    /**
     *
     * @param  {int} mass food mass
     * @return {canvas}     lighter canvas of a food
     */
    createFoodTexture(mass) {
        //TODO: food color
        const size = cfg.foodInitSize + mass * cfg.foodFactor;
        const can = this.createCanvas(size, size);
        const ctx = can.getContext('2d');
        ctx.globalCompositeOperation = "lighter";
        if (cfg.debugFood) {
            ctx.strokeStyle = 'rgba(250, 255, 0, 0.7)';
            ctx.lineWidth = 5;
            ctx.strokeRect(0, 0, size, size);
        }
        ctx.beginPath();
        const b = {
            x: size / 2,
            y: size / 2,
            rad: size / 2,
        };
        let gradblur = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.rad);
        //REVIEW: food texture: circle ? ring ?
        // let edgecolor1 = "rgba(255, 255, 255, 0.0)"; // + (0.9 + mass * 0.03) + ")";
        let edgecolor1 = "rgba(255, 255, 255, 0.4)";
        gradblur.addColorStop(0, edgecolor1);
        // gradblur.addColorStop(0.2, edgecolor2);
        gradblur.addColorStop(0.6, edgecolor1);
        // gradblur.addColorStop(0.95, edgecolor2);
        ctx.fillStyle = gradblur;
        ctx.arc(b.x, b.y, b.rad, 0, Math.PI * 2, false);
        ctx.fill();
        
        gradblur = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.rad);
        //REVIEW: food texture: circle ? ring ?
        edgecolor1 = "rgba(255, 255, 255, 0.4)"; // + (0.9 + mass * 0.03) + ")";
        const edgecolor2 = "rgba(255, 255, 255, 0.0)";
        gradblur.addColorStop(0, edgecolor2);
        // gradblur.addColorStop(0.2, edgecolor2);
        gradblur.addColorStop(0.6, edgecolor2);
        gradblur.addColorStop(0.6, edgecolor1);
        // gradblur.addColorStop(0.9, edgecolor2);
        gradblur.addColorStop(1, edgecolor2);
        ctx.fillStyle = gradblur;
        ctx.arc(b.x, b.y, b.rad, 0, Math.PI * 2, false);
        ctx.fill();
        
        // ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        // ctx.beginPath();
        // ctx.arc(b.x, b.y, b.rad - 4 - mass / 2, 0, Math.PI * 2, false);
        // ctx.fill();
        // ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        // ctx.lineWidth = 2;
        ctx.fill();
        // ctx.beginPath();
        // ctx.arc(b.x, b.y, b.rad - 10 - mass / 2, 0, Math.PI * 2, false);
        // ctx.stroke();
        // ctx.arc(b.x, b.y, b.rad - 13 - mass / 2, 0, Math.PI * 2, false);
        // ctx.stroke();
        // ctx.arc(b.x, b.y, b.rad - 22 - mass / 2, 0, Math.PI * 2, false);
        // ctx.stroke();

        // ctx.strokeStyle = "rgba(" + b.r + "," + b.g + "," + b.b + ",0.9)";
        // ctx.lineWidth = 3;
        // ctx.strokeRect(0, 0, can.width, can.height);
        return can;
    }

    /**
     *
     * @param  {int} i sample #i
     * @param  {ball} b circle object
     * @return {canvas}   lighter canvas for dash #i
     */
    createDashTexture(i, b) {
        const can = this.createCanvas(b.rad * 2, b.rad * 2);
        const ctx = can.getContext('2d');
        ctx.globalCompositeOperation = "lighter";
        ctx.beginPath();
        const gradblur = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.rad);

        const edgecolor1 = "rgba(" + b.r + "," + b.g + "," + b.b + "," + (0.6) + ")";
        const edgecolor2 = "rgba(" + b.r + "," + b.g + "," + b.b + ",0.0)";
        gradblur.addColorStop(0, edgecolor1);
        gradblur.addColorStop(0.7 + i * 0.05, edgecolor2);
        ctx.fillStyle = gradblur;
        ctx.arc(b.x, b.y, b.rad, 0, Math.PI * 2, false);
        for (let j = -3; j < i; j++) {
            ctx.fill();
        }
        return can;
    }

    createCanvas(width, height) {
        const can = document.createElement("canvas");
        can.width = width;
        can.height = height;
        return can;
    }
}
