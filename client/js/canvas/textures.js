var cfg = require('../../../shared/config');


exports = module.exports = Textures;

function Textures() {
    // this.preloadTextureFromImage();
    // this.preloadTextureFromCanvas();
}

Textures.prototype = {
    /**
     * Pixi uses Texture cache to store and reference all the textures needed.
     * Texture = WebGL format of an image, to be processed by the GPU.
     * @return {[type]} [description]
     */
    preloadTextures: function() {
        this.loader = new PIXI.loaders.Loader();
        this.loader
            // Chainable `add` to enqueue a resource
            .add("ringTxt", cfg.ringImg)
            .add("mapTxt", cfg.mapImg)
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
        var canMid = this.createBorderTexture(cfg.midLimitRad, cfg.midLimitStroke, cfg.midLimitOffset);
        this.midLimitTxt = new PIXI.Texture.fromCanvas(canMid);
        //end limit
        var canEnd = this.createBorderTexture(cfg.endLimitRad, cfg.endLimitStroke, cfg.endLimitOffset);
        this.endLimitTxt = new PIXI.Texture.fromCanvas(canEnd);

        // #80FFA0
        // #008040
        //
        // #9850FF
        // #281060
        //
        // rgba(255, 255, 255, 1)
        // rgba(150,150,150, 1)
        // rgba(80,80,80, 1)
        // rgba(80,80,80, 1)
        // rgba(80,80,80, 0)
        //
        // rgba(255, 128, 128, 1)
        // rgba(222, 3, 3, 1)
        // rgba(157, 18, 18, 1)
        //
        // rgb(192,128,255)
        // rgb(144,153,255)
        // rgb(128,208,208)
        // rgb(128,255,128)
        // rgb(238,238,112)
        // rgb(255,144,144)
        // rgb(255,64,64)
        // rgb(224,48,224)
        // rgb(255,255,255)
        // rgb(144,153,255)
        // rgb(80,80,80)
        // rgb(255,192,80)
        // rgb(40,136,96)
        // rgb(100,117,255)
        // rgb(120,134,255)
        // rgb(72,84,255)
        // rgb(160,80,255)
        // rgb(255,224,64)
        // rgb()


        // rrs=[255,56,56,78,255,101,128,60,0,217,255,144,32,240,240,240,240,32],
        // ggs=[224,68,68,35,86,200,132,192,255,69,64,144,32,32,240,144,32,240],
        // bbs=[,64,255,255,192,9,232,144,72,83,69,64,144,240,32,32,32,240,32]

        this.foodTxtList = [];
        for (var i = 0; i < cfg.foodPaletteSize; i++) {
            //TODO: should generate all possible size of foods (1-2-...)
            var canFood = this.createFoodTexture(i, 10);
            this.foodTxtList.push(new PIXI.Texture.fromCanvas(canFood));
        }

        //TODO: dash color for each skin
        this.dashTxtList = [];
        for (var i = 0; i < cfg.dashTxtSize; i++) {
            var b = {
                x: 25,
                y: 25,
                rad: 25,
                r: cfg.foodColor2[0],
                g: cfg.foodColor2[1],
                b: cfg.foodColor2[2],
            };
            var canDash = this.createDashTexture(i, b);
            this.dashTxtList.push(new PIXI.Texture.fromCanvas(canDash));
        }
        //dash textures: a-b-c-d-c-b
        //or play and rewind
        var rewind = this.dashTxtList.slice(1, -1);
        this.dashTxtList = this.dashTxtList.concat(rewind.reverse());
    },

    onAssetsLoading: function(loader, loadedResource) {
        console.log('Progress:', loader.progress + '%');
    },

    /**
     * use aliases
     * @return {void}
     */
    onAssetsLoaded: function() {
        var resources = this.loader.resources;
        // this.playerImgL.baseTexture.mipmap = false;
        // this.playerImgR.baseTexture.mipmap = false;
        // this.loader.resources.ringTxt.destroy(true);
        // PIXI.TextureCache['/client/img/bullet.png'].destroy(true);
        this.ringTxt = resources.ringTxt.texture;
        this.mapTxt = resources.mapTxt.texture;
        // this.bgTextureTxt = new this.Texture.fromImg(cfg.bgImg);
        // console.log(PIXI.loader.resources);
        this.playerTxtList = [];
        for (var i = 0; i < 3; i++) {
            this.playerTxtList.push(PIXI.Texture.fromFrame('flappy' + i + '.png'));
        }

        this.fireballTxtList = [];
        for (var i = 0; i < 6; i++) {
            this.fireballTxtList.push(PIXI.Texture.fromFrame('fireball' + i + '.png'));
        }
        //Create a rectangle object that defines the position and
        //size of the sub-image you want to extract from the texture
        // var rectangle = new Rectangle(0, 0, 512, 512);
        //
        // var txt = resources.fireballTxtSet;
        // //Tell the texture to use that rectangular section
        // txt.frame = rectangle;
        // this.ballTxtList.push(new PIXI)

        this.onTexturesLoaded();
    },

    /**
     * mid and end limit
     * @param  {float} limitRad    radius
     * @param  {float} limitStroke thickness
     * @param  {float} limitOffset negative position of the center
     * @return {canvas}            90 degrees circle of radius =
     *                                limitRad + limitStroke thickness
     */
    createBorderTexture: function(limitRad, limitStroke, limitOffset) {
        //can we decrease width/height according to scale ?
        var canSize = limitRad + limitStroke - limitOffset;
        var can = this.createCanvas(canSize, canSize);
        var ctx = can.getContext('2d');
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
    },

    /**
     *
     * @param  {int} i    color i
     * @param  {int} mass food mass
     * @return {canvas}     lighter canvas of a food
     */
    createFoodTexture: function(i, mass) {
        //TODO: food size + color
        var size = 20 + mass * 3;
        var can = this.createCanvas(size, size);
        var ctx = can.getContext('2d');
        ctx.globalCompositeOperation = "lighter";
        if (cfg.debugFood) {
            ctx.strokeStyle = 'rgba(250, 255, 0, 0.7)';
            ctx.lineWidth = 5;
            ctx.strokeRect(0, 0, size, size);
        }
        ctx.beginPath();
        var b = {
            x: size / 2,
            y: size / 2,
            rad: size / 2,
            r: cfg['foodColor' + i][0],
            g: cfg['foodColor' + i][1],
            b: cfg['foodColor' + i][2],
        };
        var gradblur = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.rad);
        //REVIEW: food texture: circle ? ring ?
        var edgecolor1 = "rgba(" + b.r + "," + b.g + "," + b.b + ",0.65)"; // + (0.9 + mass * 0.03) + ")";
        var edgecolor2 = "rgba(" + b.r + "," + b.g + "," + b.b + ",0.0)";
        gradblur.addColorStop(0, edgecolor2);
        gradblur.addColorStop(0.2, edgecolor2);
        gradblur.addColorStop(0.6, edgecolor1);
        gradblur.addColorStop(0.95, edgecolor2);
        ctx.fillStyle = gradblur;
        ctx.arc(b.x, b.y, b.rad, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "rgba(" + b.r + "," + b.g + "," + b.b + ",0.4)";
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.rad - 4 - mass / 2, 0, Math.PI * 2, false);
        // ctx.fill();
        ctx.strokeStyle = "rgba(" + b.r + "," + b.g + "," + b.b + ",0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();
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
    },

    /**
     *
     * @param  {int} i sample #i
     * @param  {ball} b circle object
     * @return {canvas}   lighter canvas for dash #i
     */
    createDashTexture: function(i, b) {
        var can = this.createCanvas(b.rad * 2, b.rad * 2);
        var ctx = can.getContext('2d');
        ctx.globalCompositeOperation = "lighter";
        ctx.beginPath();
        var gradblur = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.rad);

        var edgecolor1 = "rgba(" + b.r + "," + b.g + "," + b.b + "," + (0.6) + ")";
        var edgecolor2 = "rgba(" + b.r + "," + b.g + "," + b.b + ",0.0)";
        gradblur.addColorStop(0, edgecolor1);
        gradblur.addColorStop(0.7 + i * 0.05, edgecolor2);
        ctx.fillStyle = gradblur;
        ctx.arc(b.x, b.y, b.rad, 0, Math.PI * 2, false);
        for (var j = -3; j < i; j++) {
            ctx.fill();
        }
        return can;
    },

    createCanvas: function(width, height) {
        var can = document.createElement("canvas");
        can.width = width;
        can.height = height;
        return can;
    },
};
