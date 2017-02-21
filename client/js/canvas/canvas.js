var cfg = require('../../../shared/config'),
    lot = require('../../../shared/lot'),
    Textures = require('./textures'),
    Camera = require('./camera'),
    Hud = require('./hud');

exports = module.exports = Canvas;

function Canvas() {
    this.canvas = document.getElementById("ctx");
    this.preload();
    window.addEventListener('resize', function(e) {
        this.resizeCamera();
    }.bind(this));
    this.resizeCamera();

    this.assetsLoaded = false;
}

var dep = _.extend(Object.create(Camera.prototype),
    Object.create(Textures.prototype), Object.create(Hud.prototype));

Canvas.prototype = _.extend(dep, {
    preload: function() {
        this.renderer = new PIXI.autoDetectRenderer(cfg.scopeInitX, cfg.scopeInitY, {
            view: this.canvas
        });
        //PIXI.RESOLUTION = window.devicePixelRatio;
        this.renderer.clearBeforeRender = false;

        this.preloadTextures();
        this.preloadStage();
        Camera.call(this);
        this.preloadHud();
    },

    preloadStage: function() {
        this.stage = new PIXI.Container();
        this.stage.displayList = new PIXI.DisplayList();
        this.limitLayer = new PIXI.DisplayGroup(0, false);
        this.tunnelLayer = new PIXI.DisplayGroup(1, false);
        this.foodLayer = new PIXI.DisplayGroup(2, false);
        this.playerLayer = new PIXI.DisplayGroup(3, false);
        // this.textLayer = new PIXI.DisplayGroup(4, false);
    },

    onTexturesLoaded: function() {
        this.preloadSprites();
        this.drawMap({
            x: 0,
            y: 0,
        });
        this.assetsLoaded = true;

        signPanelDiv.style.display = 'block';
        this.canvas.style.display = 'block';
    },

    preloadSprites: function() {
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


    render: function() {
        this.renderer.render(this.stage);
        // this.renderer.render(this.foodContainer);
        this.renderer.render(this.hud);
    },

    /////////
    //DRAW //
    /////////
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


    //Stage
    drawMap: function(selfState) {
        //the middle of the canvas - selfPos
        //i.e. if self go down, the map go up
        var x = this.canvas.width / 2 - selfState.x;
        var y = this.canvas.height / 2 - selfState.y;
        //origin at the center of the map
        this.map.anchor.set(0.5);
        this.map.position.set(x, y);
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

        if (cfg.debugTileSize) {
            this.debug.lineStyle(3, 0xFF0000);
            var width = Math.floor(cfg.endLimitRad / cfg.tileAmountX);
            var height = Math.floor(cfg.endLimitRad / cfg.tileAmountY);
            this.debug.drawRect(x, y, width, height);
            // var X = Math.floor(cfg.tileAmountX * (selfState.x + cfg.endLimitRad) / (2 * cfg.endLimitRad));
            // var Y = Math.floor(cfg.tileAmountY * (selfState.y + cfg.endLimitRad) / (2 * cfg.endLimitRad));
            // var xTile = this.canvas.width / 2 - (X - cfg.tileAmountX / 2) * cfg.endLimitRad / cfg.tileAmountX;
            // var yTile = this.canvas.height / 2 - (Y - cfg.tileAmountY / 2) * cfg.endLimitRad / cfg.tileAmountY;
            // this.debug.drawRect(xTile, yTile, width, height);
        }
    },

    drawPlayer: function(player, selfState) {
        //player
        var size = lot.getPlayerSize(player.state.mass);
        if (!player.sprite) {
            player.sprite = new PIXI.extras.MovieClip(this.playerTxtList);
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

        var angle = Math.atan2(player.state.vy, player.state.vx);
        if (player.state.vx < 0) {
            // player.sprite.textures = this.playerLTxtList;
            player.sprite.scale.x = -1;
            player.sprite.rotation = angle + Math.PI;
        } else {
            player.sprite.scale.x = 1;
            player.sprite.rotation = angle;
        }
        if (!player.state.dashing && player.sprite.currentFrame === 0 && player.state.vy === cfg.playerVy) {
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

        // player.link;
        // var p1 = selfState;
        // var p2 = player.state;
        // var dist = lot.distEucl(p1.x, p1.y, p2.x, p2.y);
        // // if (dist < 1000) {
        // //グラデーションの生成
        // var size = 1000;
        // var can = this.createCanvas(size, size);
        // var ctx = can.getContext('2d');
        // var grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        // grad.addColorStop(0, 'rgba(' + 102 + ',' + 217 + ',' + 239 + ',' + (1 - dist / 1000) + ')');
        // grad.addColorStop(1, 'rgba(' + 249 + ',' + 38 + ',' + 114 + ',' + (1 - dist / 1000) + ')');
        // ctx.strokeStyle = grad;
        // //線の描画
        // ctx.beginPath();
        // ctx.moveTo(p1.x, p1.y);
        // ctx.lineTo(p2.x, p2.y);
        // ctx.closePath();
        // ctx.stroke();
        // if (player.link) {
        //     this.stage.removeChild(player.link);
        //     player.link.destroy(true);
        //     this.txts.destroy(true);
        // }
        // this.txts = new PIXI.Texture.fromCanvas(can);
        // player.link = new PIXI.Sprite(this.txts); // to delete
        // player.link.anchor.set(0.5);
        // player.link.displayGroup = this.playerLayer;
        // player.link.position.x = (p1.x + p2.x) / 2;
        // player.link.position.y = (p1.y + p2.y) / 2;
        // this.stage.addChild(player.link);

        // for (var prop in PIXI.utils.TextureCache) {
        //     console.log(prop);
        // }

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

        player.spriteRing.visible = false;
        // this.debug.clear();
        this.debug.lineStyle(2, 0xFF0000);
        if (cfg.debugSelfHitbox) {
            var selfScope = lot.getSelfScope(player.state.mass);
            this.debug.drawCircle(x, y, selfScope);
        }
        if (cfg.debugSelfScope) {
            var width = Math.floor(cfg.tileScopeAmountX * cfg.endLimitRad / cfg.tileAmountX);
            var height = Math.floor(cfg.tileScopeAmountY * cfg.endLimitRad / cfg.tileAmountY);
            this.debug.drawRect(x - width / 4, y - height / 4, width / 2, height / 2);
        }
        // this.debug.drawCircle(x, y, lot.getRingRadius(player.state.mass));
        if (cfg.debugRingHitbox) {
            this.debug.drawCircle(x, y, lot.getRingMin(player.state.mass));
            this.debug.drawCircle(x, y, lot.getRingMax(player.state.mass));
        }
    },

    drawBall: function(ball, selfState) {
        if (!ball.sprite) {
            ball.sprite = new PIXI.extras.MovieClip(this.fireballTxtList);
            ball.sprite.animationSpeed = 0.2;
            ball.sprite.play();
            ball.sprite.anchor.set(0.5);
            //ball.sprite.alpha = 0;
            ball.sprite.displayGroup = this.playerLayer;
            this.stage.addChild(ball.sprite);
        }
        // if (!ball.sprite) {
        //     //TODO: color ball + size
        //     //NOTE: texture careful!
        //
        //     this.stage.addChild(ball.sprite);
        // }
        var size = lot.getBallSize(ball.state.mass);
        ball.sprite.width = size;
        ball.sprite.height = size;
        var x = ball.state.x - selfState.x + this.canvas.width / 2;
        var y = ball.state.y - selfState.y + this.canvas.height / 2;
        ball.sprite.position.set(x, y);
        ball.sprite.rotation = ball.state.angle + Math.PI / 2;
        //
        // if (ball.sprite.alpha < 1) {
        //     ball.sprite.alpha += 0.05;
        //     ball.sprite.alpha = Math.round(ball.sprite.alpha * 100) / 100;
        //     ball.sprite.scale.set(ball.sprite.alpha);
        // }

        // if (cfg.debugFoodHitbox) {
        // this.tunnel.clear();
        this.debug.beginFill(0xFF0000);
        // var radius = lot.getBallMass(ball.state.mass);
        // this.debug.drawCircle(x, y, radius);
        this.debug.beginFill(0xFF0000, 0);
        // this.debug.drawCircle(x, y, cfg.foodEatenHitbox);
        // }
    },

    drawFood: function(food, selfState) {
        if (!food.sprite) {
            //TODO: color food + size
            //NOTE: texture careful!
            var texture = Math.round(Math.random() * (cfg.foodPaletteSize - 1));
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
            var dist = lot.distEucl(referrerState.x, referrerState.y, food.state.x, food.state.y);
            var newScale = 1 - ((cfg.foodHitbox - cfg.foodEatenHitbox) / (2 * dist));
            // food.sprite.alpha = newScale;
            if (newScale < 0) newScale = 0;
            // console.log(newScale);
            food.sprite.scale.set(newScale);
        }

        if (food.sprite.alpha < 1) {
            food.sprite.alpha += 0.05;
            food.sprite.alpha = Math.round(food.sprite.alpha * 100) / 100;
            food.sprite.scale.set(food.sprite.alpha);
        }

        if (cfg.debugFoodHitbox) {
            this.debug.lineStyle(1, 0xFF0000);
            this.debug.drawCircle(food.state.xReal - selfState.x + this.canvas.width / 2, food.state.yReal - selfState.y + this.canvas.height / 2, cfg.foodHitbox);
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
        // shoot.sprite.visible = true;
    },


    removeSprites: function(removedPlayers, removedFoods, removedShoots) {
        // sprite.destroy(); - will destroy sprite, leaving PIXI.Texture and PIXI.BaseTexture untouched
        // sprite.destroy(true); - will destroy sprite and PIXI.Texture; PIXI.BaseTexture remains untouched
        // sprite.destroy(true, true); - will destroy sprite, PIXI.Texture and PIXI.BaseTexture
        for (var i = removedPlayers.length; i--;) {
            var removedBalls = removedPlayers[i].getBallController().getEntities();
            if (removedPlayers[i].sprite) {
                this.stage.removeChild(removedPlayers[i].sprite);
                removedPlayers[i].sprite.destroy();
            }
            for (var j = removedBalls.length; j--;) {
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

    getStyle: function(factor) {
        return {
            fontFamily: 'raleway',
            fill: '#ffffff',
            stroke: '#000000',
            fontSize: Math.floor(factor * this.scale) + 'px',
            strokeThickness: (2 * this.scale),
        };
    },

});
