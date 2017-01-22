webpackHotUpdate(0,{

/***/ 39:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var cfg = __webpack_require__(6),
	    Fps = __webpack_require__(40),
	    lot = __webpack_require__(5);

	/* jshint shadow:true */
	exports = module.exports = Canvas;

	function Canvas() {
	    this.canvas = document.getElementById("ctx");
	    this.preload();
	    window.addEventListener('resize', function () {
	        this.resizeCanvas();
	        this.resizeHud();
	    }.bind(this));
	    this.resizeCanvas();
	    this.resizeHud();
	}

	Canvas.prototype = {
	    ////////////
	    //PRELOAD //
	    ////////////
	    preload: function preload() {
	        this.scale = 1;
	        this.scaleMass = 1;
	        this.renderer = new PIXI.autoDetectRenderer(cfg.scopeInitX, cfg.scopeInitY, {
	            view: this.canvas
	        });
	        //PIXI.RESOLUTION = window.devicePixelRatio;
	        this.renderer.clearBeforeRender = false;

	        this.preloadTexture();
	        this.preloadStage();
	        this.preloadHud();

	        this.drawMap({
	            x: 0,
	            y: 0
	        });
	    },

	    preloadTexture: function preloadTexture() {
	        // this.playerImageL.baseTexture.mipmap = false;
	        // this.playerImageR.baseTexture.mipmap = false;
	        this.ringTexture = new PIXI.Texture.fromImage(cfg.ringImage);
	        this.shootTexture = new PIXI.Texture.fromImage(cfg.shootImage);
	        this.mapTexture = new PIXI.Texture.fromImage(cfg.mapImage);
	        // this.bgTexture = new PIXI.Texture.fromImage(cfg.bgImage);

	        this.playerLTextures = [];
	        for (var i = 0; i < 3; i++) {
	            this.playerLTextures.push(new PIXI.Texture.fromImage('/client/img/flappyL' + i + '.png'));
	        }
	        this.playerRTextures = [];
	        for (var i = 0; i < 3; i++) {
	            this.playerRTextures.push(new PIXI.Texture.fromImage('/client/img/flappyR' + i + '.png'));
	        }

	        var canMid = this.preloadBorder(cfg.midLimitRad, cfg.midLimitStroke, cfg.midLimitOffset);
	        this.midLimitTexture = new PIXI.Texture.fromCanvas(canMid);
	        var canEnd = this.preloadBorder(cfg.endLimitRad, cfg.endLimitStroke, cfg.endLimitOffset);
	        this.endLimitTexture = new PIXI.Texture.fromCanvas(canEnd);

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

	        this.foodTextures = [];
	        for (var i = 0; i < cfg.foodPaletteSize; i++) {
	            var canFood = this.createFoodTexture(i, Math.random() * 15);
	            this.foodTextures.push(new PIXI.Texture.fromCanvas(canFood));
	        }

	        this.dashTextures = [];
	        for (var i = 0; i < 4; i++) {
	            var b = {
	                x: 25,
	                y: 25,
	                rad: 25,
	                r: cfg.foodColor2[0],
	                g: cfg.foodColor2[1],
	                b: cfg.foodColor2[2]
	            };
	            var canDash = this.createDashTexture(i, b);
	            this.dashTextures.push(new PIXI.Texture.fromCanvas(canDash));
	        }
	        //or play and rewind
	        var rewind = this.dashTextures.slice(1, -1);
	        this.dashTextures = this.dashTextures.concat(rewind.reverse());
	    },

	    createFoodTexture: function createFoodTexture(i, mass) {
	        var size = 20 + mass * 3;
	        var can = this.createCanvas(size, size);
	        var ctx = can.getContext('2d');
	        ctx.globalCompositeOperation = "lighter";
	        ctx.beginPath();
	        var b = {
	            x: size / 2,
	            y: size / 2,
	            rad: size / 2,
	            r: cfg['foodColor' + i][0],
	            g: cfg['foodColor' + i][1],
	            b: cfg['foodColor' + i][2]
	        };
	        var gradblur = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.rad);
	        var edgecolor1 = "rgba(" + b.r + "," + b.g + "," + b.b + ",0.6)"; // + (0.9 + mass * 0.03) + ")";
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
	        ctx.arc(b.x, b.y, b.rad - -mass / 2, 0, Math.PI * 2, false);
	        // ctx.fill();
	        ctx.strokeStyle = "rgba(" + b.r + "," + b.g + "," + b.b + ",0.8)";
	        ctx.lineWidth = 2;
	        ctx.stroke();
	        // ctx.strokeStyle = "rgba(" + b.r + "," + b.g + "," + b.b + ",0.9)";
	        // ctx.lineWidth = 3;
	        // ctx.strokeRect(0, 0, can.width, can.height);
	        return can;
	    },

	    createDashTexture: function createDashTexture(i, b) {
	        var can = this.createCanvas(b.rad * 2, b.rad * 2);
	        var ctx = can.getContext('2d');
	        ctx.globalCompositeOperation = "lighter";
	        ctx.beginPath();
	        var gradblur = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.rad);

	        var edgecolor1 = "rgba(" + b.r + "," + b.g + "," + b.b + "," + 0.6 + ")";
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

	    preloadBorder: function preloadBorder(limitRad, limitStroke, limitOffset) {
	        //can we decrease width/height according to scale ?
	        var canSize = limitRad + limitStroke - limitOffset;
	        var can = this.createCanvas(canSize, canSize);
	        var ctx = can.getContext('2d');
	        ctx.beginPath();
	        ctx.arc(-limitOffset, -limitOffset, limitRad + limitStroke / 2, 0, Math.PI / 2); //radius + lineWidth/2
	        ctx.lineWidth = limitStroke;
	        ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
	        ctx.stroke();
	        return can;
	    },

	    preloadStage: function preloadStage() {
	        this.stage = new PIXI.Container();
	        this.stage.displayList = new PIXI.DisplayList();
	        this.limitLayer = new PIXI.DisplayGroup(0, false);
	        this.tunnelLayer = new PIXI.DisplayGroup(1, false);
	        this.foodLayer = new PIXI.DisplayGroup(2, false);
	        this.playerLayer = new PIXI.DisplayGroup(3, false);
	        // this.textLayer = new PIXI.DisplayGroup(4, false);

	        //Map
	        this.map = new PIXI.extras.TilingSprite(this.mapTexture, cfg.mapSize, cfg.mapSize);
	        this.map.displayGroup = this.limitLayer;

	        this.stage.addChild(this.map);
	        // this.bg = new PIXI.extras.TilingSprite(this.bgTexture, cfg.mapSize, 10000);
	        // this.bg = new PIXI.Sprite(this.bgTexture);
	        // this.bg.displayGroup = this.limitLayer;
	        // this.stage.addChild(this.bg);

	        //Limit
	        this.midLimit = new PIXI.Sprite(this.midLimitTexture);
	        this.midLimit.displayGroup = this.limitLayer;
	        this.stage.addChild(this.midLimit);
	        this.endLimit = new PIXI.Sprite(this.endLimitTexture);
	        this.endLimit.displayGroup = this.limitLayer;
	        this.stage.addChild(this.endLimit);

	        //Tunnel
	        this.tunnel = new PIXI.Graphics();
	        this.tunnel.displayGroup = this.tunnelLayer;
	        this.stage.addChild(this.tunnel);

	        // this.foodContainer = new PIXI.particles.ParticleContainer(15000, {
	        //     alpha: true
	        // });
	    },

	    preloadHud: function preloadHud() {
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
	            stroke: '#000000'
	        };

	        //FPS
	        this.fps = new Fps();
	        this.fpsText = new PIXI.Text('', this.textOpt);
	        this.hud.addChild(this.fpsText);
	        var self = this;
	        setInterval(function () {
	            self.fpsText.text = 'Fps: ' + self.fps.getFps();
	        }, 1000);

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

	    ///////////
	    //RESIZE //
	    ///////////
	    resizeCanvas: function resizeCanvas() {
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

	        var canW = scale * cfg.scopeInitX;
	        var canH = scale * cfg.scopeInitY;
	        if (canW > w) {
	            this.scale = window.innerHeight / cfg.scopeInitY;
	        } else if (canH > h) {
	            this.scale = window.innerWidth / cfg.scopeInitX;
	        }

	        // console.log(this.scale);
	        this.resizeContainer(this.stage, this.scale * this.scaleMass);
	    },

	    resizeContainer: function resizeContainer(container, scale) {
	        container.scale.set(scale);
	        container.position.set(this.canvas.width * (1 - scale) / 2, this.canvas.height * (1 - scale) / 2);
	    },

	    resizeMass: function resizeMass(mass) {
	        this.scaleMass = lot.getScaleMass(mass);
	        this.resizeContainer(this.stage, this.scale * this.scaleMass);
	    },

	    resizeHud: function resizeHud() {
	        this.leaderboard.style.fontSize = this.board.offsetWidth / 7 + "px";
	        this.entry.style.fontSize = this.board.offsetWidth / 11 + "px";

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

	    getStyle: function getStyle(factor) {
	        return {
	            fontFamily: 'raleway',
	            fill: '#ffffff',
	            stroke: '#000000',
	            fontSize: Math.floor(factor * this.scale) + 'px',
	            strokeThickness: 2 * this.scale
	        };
	    },

	    /////////
	    //DRAW //
	    /////////
	    //HUD
	    drawBoard: function drawBoard(board) {
	        var len = board.length;
	        for (var i = 0; i < len; i++) {
	            this.entries[i].textContent = i + 1 + '. ' + board[i];
	        }

	        if (len < 10) {
	            for (var i = len; i < 10; i++) {
	                this.entries[i].textContent = '';
	            }
	        }
	    },

	    drawHud: function drawHud(selfState) {
	        //Mass if modif
	        if (this.score.text != 'Mass : ' + selfState.mass) {
	            this.score.text = 'Mass : ' + selfState.mass;
	        }

	        //x,y
	        this.x.text = 'x: ' + Math.round(selfState.x);
	        this.y.text = 'y: ' + Math.round(selfState.y);
	    },

	    //Stage
	    drawMap: function drawMap(selfState) {
	        //the middle of the canvas - selfPos
	        //i.e. if self go down, the map go up
	        var x = this.canvas.width / 2 - selfState.x;
	        var y = this.canvas.height / 2 - selfState.y;
	        //origin at the center of the map
	        this.map.position.x = x - cfg.mapSize / 2;
	        this.map.position.y = y - cfg.mapSize / 2;
	        this.map.alpha = 1;
	        // this.bg.position.x = x / 20;
	        // this.bg.position.y = y / 40;
	        // this.bg.alpha = 0;

	        var angle = Math.atan2(selfState.y, selfState.x);
	        this.midLimit.position.x = x + cfg.midLimitOffset * Math.sqrt(2) * Math.cos(angle);
	        this.midLimit.position.y = y + cfg.midLimitOffset * Math.sqrt(2) * Math.sin(angle);
	        this.midLimit.rotation = -Math.PI / 4 + angle;

	        this.endLimit.position.x = x + cfg.endLimitOffset * Math.sqrt(2) * Math.cos(angle);
	        this.endLimit.position.y = y + cfg.endLimitOffset * Math.sqrt(2) * Math.sin(angle);
	        this.endLimit.rotation = -Math.PI / 4 + angle;

	        this.tunnel.clear();
	        this.tunnel.beginFill(0x00FF00, 0.5);
	        if (selfState.x < 0) {
	            //
	            this.tunnel.drawRect(x - (cfg.midLimitRad + cfg.midLimitStroke), y - cfg.tunnelHeight / 2, cfg.midLimitStroke, cfg.tunnelHeight);
	        } else {
	            this.tunnel.drawRect(x + cfg.midLimitRad, y - cfg.tunnelHeight / 2, cfg.midLimitStroke, cfg.tunnelHeight);
	        }
	        this.tunnel.endFill();

	        var miniX = this.canvas.width + (selfState.x * cfg.minimapRad / cfg.midLimitRad - 60) * this.scale;
	        var miniY = this.canvas.height + (selfState.y * cfg.minimapRad / cfg.midLimitRad - 60) * this.scale;
	        this.miniself.clear();
	        this.miniself.beginFill(0x000000, 0.5);
	        this.miniself.drawCircle(miniX, miniY, cfg.miniselfRad * this.scale);
	    },

	    drawPlayer: function drawPlayer(player, selfState) {
	        //player
	        var size = lot.getPlayerSize(player.state.mass);

	        if (!player.sprite) {
	            //player.sprite = new PIXI.Sprite(this.playerImageR);
	            player.sprite = new PIXI.extras.MovieClip(this.playerRTextures);
	            player.sprite.animationSpeed = 0.15;
	            player.sprite.play();
	            player.sprite.anchor.set(0.5);
	            //player.sprite.alpha = 0;
	            player.sprite.displayGroup = this.playerLayer;
	            this.stage.addChild(player.sprite);

	            //to destroy
	            player.spriteDash = new PIXI.extras.MovieClip(this.dashTextures);
	            player.spriteDash.animationSpeed = 0.3;
	            player.spriteDash.anchor.set(0.5);
	            player.spriteDash.blendMode = PIXI.BLEND_MODES.ADD;
	            player.spriteDash.visible = false;
	            player.spriteDash.displayGroup = this.foodLayer;
	            this.stage.addChild(player.spriteDash);

	            player.spriteRing = new PIXI.Sprite(this.ringTexture);
	            player.spriteRing.anchor.set(0.5);
	            player.spriteRing.alpha = 0;
	            player.spriteRing.displayGroup = this.playerLayer;
	            this.stage.addChild(player.spriteRing);

	            player.graphics = new PIXI.Graphics();
	            this.stage.addChild(player.graphics);

	            player.text = new PIXI.Text(player.name, this.textOpt);
	            player.text.anchor.set(0.5);
	            // player.text.alpha = 1;
	            this.hud.addChild(player.text);
	        }

	        var x = player.state.x - selfState.x + this.canvas.width / 2;
	        var y = player.state.y - selfState.y + this.canvas.height / 2;

	        player.text.position.x = x;
	        player.text.position.y = y + size - 15;
	        // var scaleMass = lot.getScaleMass(player.state.mass);

	        player.text.style = this.getStyle(14);

	        if (player.state.angle < 0) {
	            player.sprite.textures = this.playerLTextures;
	            player.sprite.rotation = player.state.angle / 1000 + 8;
	        } else if (player.state.angle > 0) {
	            player.sprite.textures = this.playerRTextures;
	            player.sprite.rotation = player.state.angle / 1000 - 8;
	        }
	        if (!player.state.dashing && player.sprite.currentFrame === 0 && (player.state.angle === 9006 || player.state.angle === -2723)) {
	            player.sprite.stop();
	        } else {
	            if (!player.sprite.playing) {
	                player.sprite.play();
	            }
	        }
	        if (player.state.dashing) {
	            player.sprite.animationSpeed = 0.3;
	            if (player.sprite.alpha > 0.8) {
	                player.sprite.alpha -= 0.05;
	            }
	            player.spriteDash.play();
	            player.spriteDash.visible = true;
	        } else {
	            if (player.spriteDash.playing) {
	                player.sprite.animationSpeed = 0.15;
	                player.sprite.alpha = 1;
	                player.spriteDash.gotoAndStop(0);
	                player.spriteDash.visible = false;
	            }
	        }
	        player.sprite.position.x = x;
	        player.sprite.position.y = y;
	        player.sprite.width = size;
	        player.sprite.height = size;

	        player.spriteDash.position.x = x;
	        player.spriteDash.position.y = y;
	        player.spriteDash.width = size;
	        player.spriteDash.height = size;

	        //ring
	        size = lot.getRingSize(player.state.mass);

	        player.spriteRing.position.x = x;
	        player.spriteRing.position.y = y;
	        player.spriteRing.width = size;
	        player.spriteRing.height = size;
	        if (player.state.ring) {
	            if (player.spriteRing.alpha < 1) {
	                player.spriteRing.alpha += 0.1;
	                player.spriteRing.alpha = Math.round(player.spriteRing.alpha * 10) / 10;
	            }
	        } else {
	            if (player.spriteRing.alpha > 0) {
	                player.spriteRing.alpha = 0;
	            }
	        }
	        //
	        player.spriteRing.visible = false;

	        // var scope = (cfg.scopeInitX / 2) / lot.getScaleMass(player.state.mass);
	        var selfScope = lot.getSelfScope(player.state.mass) + 10;
	        player.graphics.clear();
	        player.graphics.lineStyle(1, 0xFF0000);
	        // player.graphics.drawCircle(x, y, selfScope);
	        player.graphics.drawCircle(x, y, lot.getRingMin(player.state.mass));
	        player.graphics.drawCircle(x, y, lot.getRingMax(player.state.mass));
	    },

	    drawFood: function drawFood(food, selfState) {
	        if (!food.sprite) {
	            // var size = cfg.foodInitSize;
	            var texture = Math.round(Math.random() * cfg.foodPaletteSize);
	            food.sprite = new PIXI.Sprite(this.foodTextures[texture]);
	            food.sprite.blendMode = PIXI.BLEND_MODES.ADD;
	            food.sprite.anchor.set(0.5);
	            food.sprite.alpha = 0;
	            food.sprite.displayGroup = this.foodLayer;
	            this.stage.addChild(food.sprite);
	        }

	        food.sprite.position.x = food.state.x - selfState.x + this.canvas.width / 2;
	        food.sprite.position.y = food.state.y - selfState.y + this.canvas.height / 2;
	        if (food.referrer) {
	            var newScale = 1 - 3 * food.state.movingTime / cfg.foodMovingTime;
	            food.sprite.scale.set(newScale);
	        }

	        if (food.sprite.alpha < 1) {
	            food.sprite.alpha += 0.05;
	            food.sprite.alpha = Math.round(food.sprite.alpha * 100) / 100;
	            food.sprite.scale.set(food.sprite.alpha);
	        }
	    },

	    drawShoot: function drawShoot(shoot, selfState) {
	        if (!shoot.sprite) {
	            shoot.sprite = new PIXI.Sprite(this.ringTexture);
	            shoot.sprite.anchor.set(0.5);
	            shoot.sprite.displayGroup = this.playerLayer;
	            this.stage.addChild(shoot.sprite);
	        }

	        var size = lot.getRingSize(shoot.state.mass);
	        var sizeFactor = shoot.state.lifeTime / cfg.dashTime;
	        if (sizeFactor > 1) {
	            sizeFactor = 1;
	        }

	        shoot.sprite.width = sizeFactor * size;
	        shoot.sprite.height = sizeFactor * size;
	        // shoot.sprite.alpha = sizeFactor;
	        shoot.sprite.position.x = shoot.state.x - selfState.x + this.canvas.width / 2;
	        shoot.sprite.position.y = shoot.state.y - selfState.y + this.canvas.height / 2;
	        //
	        shoot.sprite.visible = false;
	    },

	    removeSprites: function removeSprites(removedPlayers, removedFoods, removedShoots) {
	        for (var i = removedPlayers.length; i--;) {
	            if (removedPlayers[i].sprite) {
	                this.stage.removeChild(removedPlayers[i].sprite);
	                removedPlayers[i].sprite.destroy();
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
	                this.hud.removeChild(removedPlayers[i].text);
	                removedPlayers[i].text.destroy(true);
	            }
	        }
	        for (var i = removedFoods.length; i--;) {
	            if (removedFoods[i].sprite) {
	                this.stage.removeChild(removedFoods[i].sprite);
	                removedFoods[i].sprite.destroy();
	            }
	        }
	        for (var i = removedShoots.length; i--;) {
	            if (removedShoots[i].sprite) {
	                this.stage.removeChild(removedShoots[i].sprite);
	                removedShoots[i].sprite.destroy();
	            }
	        }
	    },

	    render: function render() {
	        this.renderer.render(this.stage);
	        // this.renderer.render(this.foodContainer);
	        this.renderer.render(this.hud);
	    },

	    createCanvas: function createCanvas(width, height) {
	        var can = document.createElement("canvas");
	        can.width = width;
	        can.height = height;
	        return can;
	    }
	};

/***/ }

})