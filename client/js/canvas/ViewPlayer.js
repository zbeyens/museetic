const cfg = require('../../../shared/config'),
    lot = require('../../../shared/lot');


export default class ViewPlayer {
    constructor(cv) {
        this.cv = cv;
        this.canvas = cv.canvas;
    }
    
    drawPlayer(player, selfState) {
        if (!player.sprite) {
            player.sprite = new PIXI.extras.MovieClip(this.cv.txt.playerTxtList);
            player.sprite.animationSpeed = 0.15;
            // player.sprite.tint = 0xffa8a8;
            player.sprite.play();
            player.sprite.anchor.set(0.5);
            //player.sprite.alpha = 0;
            player.sprite.displayGroup = this.cv.playerLayer;
            this.cv.stage.addChild(player.sprite);

            //to destroy
            player.spriteDash = new PIXI.extras.MovieClip(this.cv.txt.dashTxtList);
            player.spriteDash.animationSpeed = 0.3;
            player.spriteDash.anchor.set(0.5);
            player.spriteDash.blendMode = PIXI.BLEND_MODES.ADD;
            player.spriteDash.visible = false;
            player.spriteDash.displayGroup = this.foodLayer;
            this.cv.stage.addChild(player.spriteDash);

            player.spriteRing = new PIXI.Sprite(this.cv.txt.ringTxt);
            player.spriteRing.anchor.set(0.5);
            player.spriteRing.alpha = 0;
            player.spriteRing.displayGroup = this.cv.playerLayer;
            this.cv.stage.addChild(player.spriteRing);

            player.graphics = new PIXI.Graphics();
            this.cv.stage.addChild(player.graphics);

            player.text = new PIXI.Text(player.name, cfg.textOpt);
            player.text.anchor.set(0.5);
            // player.text.alpha = 1;
            this.cv.hud.container.addChild(player.text);
        }

        let size = lot.getPlayerSpriteRadius(player.state.mass);

        const x = player.state.x - selfState.x + this.canvas.width / 2;
        const y = player.state.y - selfState.y + this.canvas.height / 2;

        player.text.position.x = x;
        player.text.position.y = y + size - 15;
        // const scaleMass = lot.getScaleMass(player.state.mass);

        player.text.style = lot.getStyle(14, this.cv.cam.scale);

        const angle = Math.atan2(player.state.vy, player.state.vx);
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
        player.sprite.position.x = x - 3;
        player.sprite.position.y = y + 8;
        player.sprite.width = size;
        // player.sprite.height = size;
        player.sprite.height = size*(player.sprite._texture.baseTexture.height/player.sprite._texture.baseTexture.width);

        player.spriteDash.position.x = x;
        player.spriteDash.position.y = y;
        player.spriteDash.width = size;
        player.spriteDash.height = size;

        // player.link;
        // const p1 = selfState;
        // const p2 = player.state;
        // const dist = lot.distEucl(p1.x, p1.y, p2.x, p2.y);
        // // if (dist < 1000) {
        // //グラデーションの生成
        // const size = 1000;
        // const can = this.createCanvas(size, size);
        // const ctx = can.getContext('2d');
        // const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
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
        //     this.cv.stage.removeChild(player.link);
        //     player.link.destroy(true);
        //     this.cv.txts.destroy(true);
        // }
        // this.cv.txts = new PIXI.Texture.fromCanvas(can);
        // player.link = new PIXI.Sprite(this.cv.txts); // to delete
        // player.link.anchor.set(0.5);
        // player.link.displayGroup = this.cv.playerLayer;
        // player.link.position.x = (p1.x + p2.x) / 2;
        // player.link.position.y = (p1.y + p2.y) / 2;
        // this.cv.stage.addChild(player.link);

        // for (let prop in PIXI.utils.TextureCache) {
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
        // this.cv.debug.clear();
        this.cv.debug.lineStyle(2, 0xFF0000);
        if (cfg.debugSelfHitbox) {
            const selfRadius = lot.getSelfRadius(player.state.mass);
            this.cv.debug.drawCircle(x, y, selfRadius);
        }
        if (cfg.debugSelfScope) {
            const width = Math.floor(cfg.tileScopeAmountX * cfg.endLimitRad / cfg.tileAmountX);
            const height = Math.floor(cfg.tileScopeAmountY * cfg.endLimitRad / cfg.tileAmountY);
            this.cv.debug.drawRect(x - width / 4, y - height / 4, width / 2, height / 2);
        }
        // this.cv.debug.drawCircle(x, y, lot.getRingRadius(player.state.mass));
        if (cfg.debugRingHitbox) {
            this.cv.debug.drawCircle(x, y, lot.getRingMin(player.state.mass));
            this.cv.debug.drawCircle(x, y, lot.getRingMax(player.state.mass));
        }
    }
}