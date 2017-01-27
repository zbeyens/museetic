var cfg = require('../../../shared/config'),
    Fps = require('../../../shared/fps'),
    lot = require('../../../shared/lot'),
    Textures = require('./textures'),
    Camera = require('./camera.js');

exports = module.exports = Canvas;

function Canvas() {
    this.canvas = document.getElementById("ctx");
    this.preload();
    window.addEventListener('resize', function() {
        this.resizeCamera();
    }.bind(this));
    this.resizeCamera();
}

Canvas.prototype = _.extend(Object.create(Camera.prototype), Object.create(Textures.prototype), {
    preload: function() {
        this.scale = 1;
        this.scaleMass = 1;
        this.renderer = new PIXI.autoDetectRenderer(cfg.scopeInitX, cfg.scopeInitY, {
            view: this.canvas
        });
        //PIXI.RESOLUTION = window.devicePixelRatio;
        this.renderer.clearBeforeRender = false;

        Textures.call(this);
        this.preloadStage();
        this.preloadHud();

        this.drawMap({
            x: 0,
            y: 0,
        });
    },

    preloadStage: function() {
        this.stage = new PIXI.Container();
        this.stage.displayList = new PIXI.DisplayList();
        this.limitLayer = new PIXI.DisplayGroup(0, false);
        this.tunnelLayer = new PIXI.DisplayGroup(1, false);
        this.foodLayer = new PIXI.DisplayGroup(2, false);
        this.playerLayer = new PIXI.DisplayGroup(3, false);
        // this.textLayer = new PIXI.DisplayGroup(4, false);

        //Map
        this.map = new PIXI.extras.TilingSprite(this.mapTxt, cfg.mapSize, cfg.mapSize);
        this.map.displayGroup = this.limitLayer;

        this.stage.addChild(this.map);
        // this.bg = new PIXI.extras.TilingSprite(this.bgTexture, cfg.mapSize, 10000);
        // this.bg = new PIXI.Sprite(this.bgTexture);
        // this.bg.displayGroup = this.limitLayer;
        // this.stage.addChild(this.bg);

        //Limit
        this.midLimit = new PIXI.Sprite(this.midLimitTxt);
        this.midLimit.displayGroup = this.limitLayer;
        this.stage.addChild(this.midLimit);
        this.endLimit = new PIXI.Sprite(this.endLimitTxt);
        this.endLimit.displayGroup = this.limitLayer;
        this.stage.addChild(this.endLimit);

        //Tunnel
        this.tunnel = new PIXI.Graphics();
        this.tunnel.displayGroup = this.tunnelLayer;
        this.stage.addChild(this.tunnel);

        //Debug layer
        this.debug = new PIXI.Graphics();
        this.debug.displayGroup = this.tunnelLayer;
        this.stage.addChild(this.debug);

        // this.foodContainer = new PIXI.particles.ParticleContainer(15000, {
        //     alpha: true
        // });
    },

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
        var self = this;
        setInterval(function() {
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


    getStyle: function(factor) {
        return {
            fontFamily: 'raleway',
            fill: '#ffffff',
            stroke: '#000000',
            fontSize: Math.floor(factor * this.scale) + 'px',
            strokeThickness: (2 * this.scale),
        };
    },

    /////////
    //DRAW //
    /////////
    //HUD
    drawBoard: function(board) {
        var len = board.length;
        for (var i = 0; i < len; i++) {
            this.entries[i].textContent = (i + 1) + '. ' + board[i];
        }

        if (len < 10) {
            for (var i = len; i < 10; i++) {
                this.entries[i].textContent = '';
            }
        }
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


    //Stage
    drawMap: function(selfState) {
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
        if (selfState.x < 0) { //
            this.tunnel.drawRect(x - (cfg.midLimitRad + cfg.midLimitStroke), y - cfg.tunnelHeight / 2, cfg.midLimitStroke, cfg.tunnelHeight);
        } else {
            this.tunnel.drawRect(x + cfg.midLimitRad, y - cfg.tunnelHeight / 2, cfg.midLimitStroke, cfg.tunnelHeight);
        }

        var miniX = this.canvas.width + (selfState.x * cfg.minimapRad / cfg.midLimitRad - 60) * this.scale;
        var miniY = this.canvas.height + (selfState.y * cfg.minimapRad / cfg.midLimitRad - 60) * this.scale;
        this.miniself.clear();
        this.miniself.beginFill(0x000000, 0.5);
        this.miniself.drawCircle(miniX, miniY, cfg.miniselfRad * this.scale);

        this.debug.clear();
    },

    drawPlayer: function(player, selfState) {
        //player
        var size = lot.getPlayerSize(player.state.mass);
        if (!player.sprite) {
            //player.sprite = new PIXI.Sprite(this.playerImageR);

            player.sprite = new PIXI.extras.MovieClip(this.playerRTxtList);
            player.sprite.animationSpeed = 0.15;
            player.sprite.play();
            player.sprite.anchor.set(0.5);
            //player.sprite.alpha = 0;
            player.sprite.displayGroup = this.playerLayer;
            this.stage.addChild(player.sprite);

            //to destroy
            player.spriteDash = new PIXI.extras.MovieClip(this.dashTxtList);
            player.spriteDash.animationSpeed = 0.3;
            player.spriteDash.anchor.set(0.5);
            player.spriteDash.blendMode = PIXI.BLEND_MODES.ADD;
            player.spriteDash.visible = false;
            player.spriteDash.displayGroup = this.foodLayer;
            this.stage.addChild(player.spriteDash);

            player.spriteRing = new PIXI.Sprite(this.ringTxt);
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
            player.sprite.textures = this.playerLTxtList;
            player.sprite.rotation = (player.state.angle / 1000) + 8;
        } else if (player.state.angle > 0) {
            player.sprite.textures = this.playerRTxtList;
            player.sprite.rotation = (player.state.angle / 1000) - 8;
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

    drawFood: function(food, selfState) {
        if (!food.sprite) {
            // var size = cfg.foodInitSize;

            //TODO: color food + size
            var texture = Math.round(Math.random() * cfg.foodPaletteSize);
            food.sprite = new PIXI.Sprite(this.foodTxtList[texture]);
            food.sprite.blendMode = PIXI.BLEND_MODES.ADD;
            food.sprite.anchor.set(0.5);
            food.sprite.alpha = 0;
            food.sprite.displayGroup = this.foodLayer;
            this.stage.addChild(food.sprite);
        }
        var x = food.state.x - selfState.x + this.canvas.width / 2;
        var y = food.state.y - selfState.y + this.canvas.height / 2;
        food.sprite.position.x = x;
        food.sprite.position.y = y;
        if (food.referrer) {
            var referrerState = food.referrer.state;
            var dist = lot.inCircle(referrerState.x, referrerState.y, food.state.x, food.state.y);
            var newScale = 1 - ((cfg.foodHitbox - cfg.foodEatenHitbox) / dist);
            food.sprite.scale.set(newScale);
        }

        if (food.sprite.alpha < 1) {
            food.sprite.alpha += 0.05;
            food.sprite.alpha = Math.round(food.sprite.alpha * 100) / 100;
            food.sprite.scale.set(food.sprite.alpha);
        }
        if (cfg.debugFoodHitbox) {
            this.debug.lineStyle(1, 0xFF0000);
            this.debug.drawCircle(x, y, cfg.foodHitbox);
            // this.debug.drawCircle(x, y, cfg.foodEatenHitbox);
        }
    },

    drawShoot: function(shoot, selfState) {
        if (!shoot.sprite) {
            shoot.sprite = new PIXI.Sprite(this.ringTxt);
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


    removeSprites: function(removedPlayers, removedFoods, removedShoots) {
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

    render: function() {
        this.renderer.render(this.stage);
        // this.renderer.render(this.foodContainer);
        this.renderer.render(this.hud);
    },

});
