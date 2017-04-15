var BufferReader = require('../../../../shared/BufferReader'),
    cfg = require('../../../../shared/config');

exports = module.exports = Receiver;

function Receiver() {
    this.seqUpdates = 0;
    this.handler = {
        1: this.onMsgSubmit.bind(this),
        2: this.onMsgClear.bind(this),
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

        this.socket.onerror = function(evt) {
            console.log("ERROR " + evt.data);
        };
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

    onMsgClear: function(msg) {
        this.stateController.clearEntities();

        //if game over
        if (this.selfId !== -1) {
            this.selfId = -1;
            this.inTransition = true;
        }
    },

    /**
     * inTransition, set selfId, clearEntities before joining game
     * inTransition false to stop spectator spawn
     * @param  {Buffer} msg
     * @return {void}
     */
    onMsgSubmit: function(msg) {
        var buf = new BufferReader(msg);
        buf.addOffset(1);
        var id = buf.getUint16();
        console.log(id);
        this.selfId = id;
        this.inTransition = true;
    },

    /**
     * onUpdate, broadcast loop
     */
    onMsgUpdate: function(msg) {
        // cl
        var buf = new BufferReader(msg);
        buf.addOffset(1);
        var t = buf.getUint32();
        // console.log(t - this.stateController.serverTime);
        if (this.stateController.rendering) {
            this.stateController.rendered -= (t - this.stateController.serverTime);
            // console.log("whut " + (t - this.stateController.serverTime));
        }
        // console.log((t - this.stateController.serverTime));
        this.stateController.setServerTime(t);

        var flagsMain = buf.getFlags(),
            updatePsFlag = flagsMain[0],
            playersScopeRemoveFlag = flagsMain[1],
            shootsScopeInitFlag = flagsMain[2],
            foodsScopeInitFlag = flagsMain[3],
            foodsScopeRemoveFlag = flagsMain[4],
            foodsScopeEatFlag = flagsMain[5],
            updateBoardFlag = flagsMain[6];
        if (updatePsFlag) {
            var lenUpdatePs = buf.getUint8(),
                updatePs = [];

            // console.log(this.stateController.playerController.entities);
            // console.log("new " + lenUpdatePs);
            for (var i = 0; i < lenUpdatePs; i++) {
                var id = buf.getUint16(),
                    state = {},
                    name, ballAngle;

                var flagsPlayer = buf.getFlags(),
                    nameFlag = flagsPlayer[0],
                    xFlag = flagsPlayer[1],
                    yFlag = flagsPlayer[2],
                    vxFlag = flagsPlayer[3],
                    vyFlag = flagsPlayer[4],
                    massFlag = flagsPlayer[5];
                state.ring = flagsPlayer[6];
                state.dashing = flagsPlayer[7];

                var flagsPlayer2 = buf.getFlags(),
                    ballAngleFlag = flagsPlayer2[0];

                if (nameFlag) {
                    name = buf.getStringUTF8();
                }
                if (xFlag) {
                    state.x = buf.getFloat32();
                }
                if (yFlag) {
                    state.y = buf.getFloat32();
                }
                if (vxFlag) {
                    var vxModif = buf.getInt16();
                    state.vx = vxModif / 100.0;
                }
                if (vyFlag) {
                    var vyModif = buf.getInt16();
                    state.vy = vyModif / 100.0;
                }
                if (massFlag) {
                    state.mass = buf.getUint32();
                }

                if (ballAngleFlag) {
                    ballAngle = buf.getFloat32();
                    console.log("angle " + ballAngle);
                }

                if (!nameFlag) {
                    updatePs.push([id, state]);
                } else {
                    console.log(id);
                    updatePs.push([id, state, name, ballAngle]);
                }
            }
            this.stateController.addPlayerUpdates(t, updatePs);
        }


        //foods to remove: id
        if (playersScopeRemoveFlag) {
            var lenPlayersScopeRemove = buf.getUint16(),
                playersScopeRemove = [];
            for (var i = 0; i < lenPlayersScopeRemove; i++) {
                var id = buf.getUint16();
                playersScopeRemove.push(id);
            }
            this.stateController.updatePlayerRemoveStates(playersScopeRemove);
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
                state.y = state.yReal;
                var mass = buf.getUint8();
                foodsScopeInit.push([id, state, mass]);
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
