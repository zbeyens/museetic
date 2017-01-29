var BufferWriter = require('../../shared/BufferWriter');

/* jshint shadow:true */
module.exports = Update;

function Update(states) {
    this.states = states;
}

/**
 * #10: all updates
 * a Flag is put for the existance of data
 * Flag = 0 if length = 0
 * Length + data
 * @return {Buffer}
 */
Update.prototype.form = function() {
    var buf = new BufferWriter();
    var t = this.states.t,
        updatePs = this.states.updatePs,
        playersScopeRemove = this.states.playersScopeRemove,
        shootsScopeInit = this.states.shootsScopeInit,
        foodsScopeInit = this.states.foodsScopeInit,
        foodsScopeRemove = this.states.foodsScopeRemove,
        foodsScopeEat = this.states.foodsScopeEat,
        updateBoard = this.states.updateBoard,
        updatePsFlag = updatePs.length === 0 ? 0 : 1,
        playersScopeRemoveFlag = playersScopeRemove.length === 0 ? 0 : 1,
        shootsScopeInitFlag = shootsScopeInit.length === 0 ? 0 : 1,
        foodsScopeInitFlag = foodsScopeInit.length === 0 ? 0 : 1,
        foodsScopeRemoveFlag = foodsScopeRemove.length === 0 ? 0 : 1,
        foodsScopeEatFlag = foodsScopeEat.length === 0 ? 0 : 1,
        updateBoardFlag = updateBoard.length === 0 ? 0 : 1;

    buf.setUint8(10);
    buf.setUint32(t);

    //flags
    var flagsMain = [];
    flagsMain.push(updatePsFlag);
    flagsMain.push(playersScopeRemoveFlag);
    flagsMain.push(shootsScopeInitFlag);
    flagsMain.push(foodsScopeInitFlag);
    flagsMain.push(foodsScopeRemoveFlag);
    flagsMain.push(foodsScopeEatFlag);
    flagsMain.push(updateBoardFlag);
    buf.setFlags(flagsMain);

    if (updatePsFlag) {
        buf.setUint8(updatePs.length);
        for (var i = 0; i < updatePs.length; i++) {
            var id = updatePs[i][0],
                name = updatePs[i][2],
                x = updatePs[i][1].x,
                y = updatePs[i][1].y,
                vx = updatePs[i][1].vx,
                vy = updatePs[i][1].vy,
                mass = updatePs[i][1].mass,
                ring = updatePs[i][1].ring,
                dashing = updatePs[i][1].dashing,
                nameFlag = name === undefined ? 0 : 1,
                xFlag = x === undefined ? 0 : 1,
                yFlag = y === undefined ? 0 : 1,
                vxFlag = vx === undefined ? 0 : 1,
                vyFlag = vy === undefined ? 0 : 1,
                massFlag = mass === undefined ? 0 : 1;

            buf.setUint16(id);
            //flags
            var flagsPlayer = [];
            flagsPlayer.push(nameFlag);
            flagsPlayer.push(xFlag);
            flagsPlayer.push(yFlag);
            flagsPlayer.push(vxFlag);
            flagsPlayer.push(vyFlag);
            flagsPlayer.push(massFlag);
            flagsPlayer.push(ring);
            flagsPlayer.push(dashing);
            buf.setFlags(flagsPlayer);

            if (nameFlag) {
                buf.setStringUTF8(name);
            }
            if (xFlag) {
                buf.setFloat32(x);
            }
            if (yFlag) {
                buf.setFloat32(y);
            }
            if (vxFlag) {
                var vxModif = Math.round(vx * 100);
                buf.setInt16(vxModif);
            }
            if (vyFlag) {
                var vyModif = Math.round(vy * 100);
                buf.setInt16(vyModif);
            }
            if (massFlag) {
                buf.setUint32(mass);
            }
        }
    }

    if (playersScopeRemoveFlag) {
        buf.setUint16(playersScopeRemove.length);
        for (var i = 0; i < playersScopeRemove.length; i++) {
            var id = playersScopeRemove[i];

            buf.setUint16(id);
        }
    }

    if (shootsScopeInitFlag) {
        buf.setUint8(shootsScopeInit.length);
        for (var i = 0; i < shootsScopeInit.length; i++) {
            var x = shootsScopeInit[i].x,
                y = shootsScopeInit[i].y,
                mass = shootsScopeInit[i].mass,
                lifeTime = shootsScopeInit[i].lifeTime;

            buf.setFloat32(x);
            buf.setFloat32(y);
            buf.setUint16(mass);
            buf.setUint16(lifeTime);
        }
    }

    if (foodsScopeInitFlag) {
        buf.setUint16(foodsScopeInit.length);
        for (var i = 0; i < foodsScopeInit.length; i++) {
            var id = foodsScopeInit[i][0],
                x = foodsScopeInit[i][1].x,
                y = foodsScopeInit[i][1].y;
            //id
            buf.setUint16(id);
            buf.setFloat32(x);
            buf.setFloat32(y);
        }
    }

    if (foodsScopeRemoveFlag) {
        buf.setUint16(foodsScopeRemove.length);
        for (var i = 0; i < foodsScopeRemove.length; i++) {
            var id = foodsScopeRemove[i];

            buf.setUint16(id);
        }
    }

    if (foodsScopeEatFlag) {
        buf.setUint8(foodsScopeEat.length);
        for (var i = 0; i < foodsScopeEat.length; i++) {
            var id = foodsScopeEat[i][0],
                referrerId = foodsScopeEat[i][1];

            buf.setUint16(id);
            buf.setUint16(referrerId);
        }
    }

    if (updateBoardFlag) {
        buf.setUint8(updateBoard.length);
        for (var i = 0; i < updateBoard.length; i++) {
            buf.setStringUTF8(updateBoard[i]);
        }
    }

    var buff = buf.form();
    var dv = new DataView(buff);

    // console.log(dv.getUint32(1, true));
    return buff;
};
