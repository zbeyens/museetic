var BufferReader = require('../../../../shared/BufferReader'),
    cfg = require('../../../../shared/config');

exports = module.exports = Receiver;

function Receiver() {
    this.handler = {
        1: this.onMsgSubmit.bind(this),
        // 1: this.message_onSpectate,
        10: this.onMsgUpdate.bind(this),
    };
    this.handleSocketEvents();
}

Receiver.prototype = {
    /**
     * handle onmessage, onclose
     * @return {void}
     */
    handleSocketEvents: function() {
        this.socket.onmessage = function(msg) {
            var buf = msg.data;
            this.handleMessage(buf);
        }.bind(this);

        this.socket.onclose = function() {
            this.onDisconnect();
        }.bind(this);
    },

    /**
     * get the packetId of a message if not empty
     * @param  {Buffer} buf
     * @return {void}
     */
    handleMessage: function(buf) {
        if (buf.byteLength === 0) return;
        var view = new DataView(buf);
        var packetId = view.getUint8(0);
        // console.log(packetId + "..." + this.selfId);
        if (!this.handler.hasOwnProperty(packetId)) return;
        this.handler[packetId](buf);
    },


    /**
     * leftSpectator, set selfId, clearEntities before joining game
     * isSpectator false to stop spectator spawn
     * @param  {Buffer} msg
     * @return {void}
     */
    onMsgSubmit: function(msg) {
        this.stateController.isSpectator = false;
        var buf = new BufferReader(msg);
        buf.addOffset(1);
        var id = buf.getUint16();
        setTimeout(function() {
            // console.log(this.stateController.playerController.entities);
            // this.stateController.clearEntities();
            this.selfId = id;
            this.leftSpectator = true;
            this.onSubmitted();
        }.bind(this), cfg.clientInterpolationTime);
    },

    /**
     * onUpdate, broadcast loop
     * only if not lefting spectator
     */
    onMsgUpdate: function(msg) {
        var buf = new BufferReader(msg);
        buf.addOffset(1);
        var t = buf.getUint32();
        this.stateController.setTime(t);
        // this.oldTime = new Date();
        // console.log(t - this.oldTime);
        this.oldTime = t;

        var flagsMain = buf.getFlags(6),
            updatePsFlag = flagsMain[0],
            shootsScopeInitFlag = flagsMain[1],
            foodsScopeInitFlag = flagsMain[2],
            foodsScopeRemoveFlag = flagsMain[3],
            foodsScopeEatFlag = flagsMain[4],
            updateBoardFlag = flagsMain[5];

        if (updatePsFlag) {
            var lenUpdatePs = buf.getUint8(),
                updatePs = [];

            // console.log(this.stateController.playerController.entities);
            // console.log("new " + lenUpdatePs);
            for (var i = 0; i < lenUpdatePs; i++) {
                var id = buf.getUint16(),
                    state = {},
                    name;

                var flagsPlayer = buf.getFlags(7),
                    nameFlag = flagsPlayer[0],
                    xFlag = flagsPlayer[1],
                    yFlag = flagsPlayer[2],
                    angleFlag = flagsPlayer[3],
                    massFlag = flagsPlayer[4];
                state.ring = flagsPlayer[5];
                state.dashing = flagsPlayer[6];

                if (nameFlag) {
                    name = buf.getStringUTF8();
                }
                if (xFlag) {
                    state.x = buf.getFloat32();
                }
                if (yFlag) {
                    state.y = buf.getFloat32();
                }
                if (angleFlag) {
                    state.angle = buf.getInt16();
                }
                if (massFlag) {
                    state.mass = buf.getUint16();
                }

                if (!nameFlag) {
                    updatePs.push([id, state]);
                } else {
                    updatePs.push([id, state, name]);
                }
            }
            this.stateController.addPlayerUpdates(t, updatePs);
        }

        if (shootsScopeInitFlag) {
            var lenShootsScopeInit = buf.getUint8(),
                shootsScopeInit = [];
            for (var i = 0; i < lenShootsScopeInit; i++) {
                var state = {};

                state.x = buf.getFloat32();
                state.y = buf.getFloat32();
                state.mass = buf.getUint16();
                state.lifeTime = buf.getUint16();
                shootsScopeInit.push([null, state]);
            }
            this.stateController.updateShootStates(shootsScopeInit);
        }

        // new foods: id, xReal, yReal
        if (foodsScopeInitFlag) {
            var lenFoodsScopeInit = buf.getUint16(),
                foodsScopeInit = [];
            for (var i = 0; i < lenFoodsScopeInit; i++) {
                var id = buf.getUint16(),
                    state = {
                        movingTime: 0,
                        angle: 0,
                        vr: Math.random(),
                    };

                state.xReal = buf.getFloat32();
                state.yReal = buf.getFloat32();
                state.x = state.xReal;
                state.y = state.xReal;
                foodsScopeInit.push([id, state]);
            }
            this.stateController.updateFoodInitStates(foodsScopeInit);
        }

        //foods to remove: id
        if (foodsScopeRemoveFlag) {
            var lenFoodsScopeRemove = buf.getUint16(),
                foodsScopeRemove = [];
            for (var i = 0; i < lenFoodsScopeRemove; i++) {
                var id = buf.getUint16();
                foodsScopeRemove.push(id);
            }
            this.stateController.updateFoodRemoveStates(foodsScopeRemove);
        }

        //foods to eat: id, referrerId
        if (foodsScopeEatFlag) {
            var lenFoodsScopeEat = buf.getUint8(),
                foodsScopeEat = [];
            for (var i = 0; i < lenFoodsScopeEat; i++) {
                var id = buf.getUint16(),
                    referrerId = buf.getUint16();
                foodsScopeEat.push([id, referrerId]);
            }
            this.stateController.updateFoodEatStates(foodsScopeEat);
        }

        if (updateBoardFlag) {
            var lenUpdateBoard = buf.getUint8(),
                updateBoard = [];
            for (var i = 0; i < lenUpdateBoard; i++) {
                var name = buf.getStringUTF8();
                updateBoard.push(name);
            }
            this.stateController.updateBoard(updateBoard);
        }
    },
};
