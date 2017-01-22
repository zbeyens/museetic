webpackHotUpdate(0,{

/***/ 2:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Debug = __webpack_require__(3),
	    Chat = __webpack_require__(4),
	    lot = __webpack_require__(5),
	    Packet = __webpack_require__(10),
	    BufferReader = __webpack_require__(14),
	    GamePhysics = __webpack_require__(15),
	    cfg = __webpack_require__(6);

	/* jshint shadow:true */
	/* jshint loopfunc:true */

	exports = module.exports = Client;

	function StateController() {
	    this.clientTime = 0;
	    this.renderTime = 0;
	    this.interpolationTime = cfg.clientInterpolationTime;
	    this.smoothingFactor = cfg.clientSmoothingFactor;

	    this.playerController = new PlayerController();
	    this.foodController = new FoodController();
	    this.shootController = new ShootController();

	    if (cfg.debug) {
	        this.debug = new Debug();
	    }
	    this.lagCompensation = cfg.serverLagCompensation;
	    this.i = 0;
	}
	StateController.prototype = {
	    //Updates interpolated and prediction
	    updatePlayerStates: function updatePlayerStates() {
	        var entities = this.playerController.getEntities();
	        for (var i = entities.length; i--;) {
	            var entity = entities[i];
	            if (entity.getUpdates().length) {
	                this.updatePlayerState(entity);
	            }
	        }
	    },

	    updatePlayerState: function updatePlayerState(entity) {
	        var pos,
	            interpolationFactor,
	            newState,
	            pos = entity.getInterpolatedUpdates(this.renderTime);

	        if (pos.previous && pos.target) {
	            interpolationFactor = this.getInterpolatedValue(pos.previous.time, pos.target.time, this.renderTime);

	            newState = GamePhysics.getInterpolatedEntityState(pos.previous.state, pos.target.state, interpolationFactor);
	            newState = GamePhysics.getInterpolatedEntityState(entity.state, newState, this.smoothingFactor);
	            entity.setState(newState);

	            //entities can be drawed after the first state interpolation
	            if (!entity.isVisible()) {
	                entity.setVisible(true);
	            }
	        } else {
	            //remove after interpolationTime
	            if (entity.isToRemove()) {
	                this.playerController.removeEntity(entity);
	            }
	        }
	    },

	    getInterpolatedValue: function getInterpolatedValue(previousTime, targetTime, renderTime) {
	        var range = targetTime - previousTime,
	            difference = renderTime - previousTime,
	            value = parseFloat((difference / range).toFixed(3));

	        return value;
	    },

	    predictShootStates: function predictShootStates(deltaTime) {
	        var entities = this.shootController.getEntities();
	        for (var i = entities.length; i--;) {
	            var shoot = entities[i];
	            var newState = GamePhysics.getNewShootState(shoot, deltaTime);
	            if (newState) {
	                shoot.setState(newState);
	            } else {
	                this.shootController.removeEntity(shoot);
	            }
	        }
	    },

	    predictFoodStates: function predictFoodStates(deltaTime) {
	        var entities = this.foodController.getEntities();
	        for (var i = entities.length; i--;) {
	            var food = entities[i];

	            var newState = GamePhysics.getNewFoodState(food, deltaTime);
	            if (newState) {
	                food.setState(newState);
	            } else {
	                this.foodController.removeEntity(food);
	            }
	        }
	    },

	    //Updates message
	    addPlayerUpdates: function addPlayerUpdates(time, updatePs) {
	        for (var i = updatePs.length; i--;) {
	            var playerState = updatePs[i],
	                player;

	            var j = lot.idxOf(this.playerController.getEntities(), 'id', playerState[0]);
	            if (j >= 0) {
	                player = this.playerController.getEntities()[j];
	            } else {
	                player = this.playerController.add(playerState[0], playerState[2]);
	            }
	            player.addUpdate(playerState[1], time);
	            player.inScope = true;
	        }
	        var entities = this.playerController.getEntities();
	        for (var i = entities.length; i--;) {
	            var player = entities[i];
	            if (!player.inScope) {
	                player.setToRemove(true);
	            } else {
	                player.inScope = false;
	            }
	        }
	    },

	    updateShootStates: function updateShootStates(dataInit) {
	        this.initStates(dataInit, this.shootController);
	    },

	    updateFoodInitStates: function updateFoodInitStates(dataInit) {
	        this.initStates(dataInit, this.foodController);
	    },

	    initStates: function initStates(states, controller) {
	        var self = this;

	        for (var i = states.length; i--;) {
	            (function () {
	                var entityState = states[i];

	                setTimeout(function () {
	                    var newEntity = controller.add(entityState[0]);
	                    newEntity.setState(entityState[1]);
	                }, self.interpolationTime);
	            })();
	        }
	    },

	    updateFoodRemoveStates: function updateFoodRemoveStates(dataRemove) {
	        var self = this;

	        for (var i = dataRemove.length; i--;) {
	            (function () {
	                var entityId = dataRemove[i];
	                setTimeout(function () {
	                    var foods = self.foodController.getEntities();
	                    var idx = lot.idxOf(foods, 'id', entityId);
	                    if (idx >= 0) {
	                        self.foodController.remove(idx);
	                    }
	                }, self.interpolationTime);
	            })();
	        }
	    },

	    updateFoodEatStates: function updateFoodEatStates(dataEat) {
	        var self = this;

	        for (var i = dataEat.length; i--;) {
	            (function () {
	                var foodId = dataEat[i][0],
	                    referrerId = dataEat[i][1];
	                setTimeout(function () {
	                    var foods = self.foodController.getEntities();
	                    //optional check
	                    var idx = lot.idxOf(foods, 'id', foodId);
	                    if (idx >= 0) {
	                        var food = foods[idx];
	                        var players = self.playerController.getEntities();
	                        var idxPlayer = lot.idxOf(players, 'id', referrerId);
	                        if (idxPlayer >= 0) {
	                            var player = players[idxPlayer];
	                            food.referrer = player;
	                        }
	                    }
	                }, self.interpolationTime);
	            })();
	        }
	    },

	    updateBoard: function updateBoard(data) {
	        if (data.length) {
	            this.playerController.setBoard(data);
	            this.playerController.setUpdatedBoard(true);
	        }
	    },

	    //Remove

	    //Setters
	    setTime: function setTime(serverTime) {
	        this.clientTime = serverTime;
	        this.renderTime = this.clientTime - this.interpolationTime;
	    },

	    //Getters
	    getPlayerController: function getPlayerController() {
	        return this.playerController;
	    },

	    getFoodController: function getFoodController() {
	        return this.foodController;
	    },

	    getShootController: function getShootController() {
	        return this.shootController;
	    },

	    getRenderTime: function getRenderTime() {
	        return this.renderTime;
	    }
	};

	function EntityController() {
	    this.entities = [];
	    this.removedEntities = [];
	}
	EntityController.prototype = {
	    //Remove
	    removeEntity: function removeEntity(entity) {
	        var i = this.entities.indexOf(entity);
	        this.remove(i);
	    },

	    removeId: function removeId(id) {
	        var i = lot.idxOf(this.entities, 'id', id);
	        this.remove(i);
	    },

	    remove: function remove(i) {
	        if (i >= 0) {
	            this.removedEntities.push(this.entities[i]);
	            this.entities.splice(i, 1);
	        }
	    },

	    clearEntities: function clearEntities() {
	        //onDisconnect, game over and change mode
	        for (var i = this.entities.length; i--;) {
	            this.removedEntities.push(this.entities[i]);
	            this.entities.splice(i, 1);
	        }
	    },

	    clearRemovedEntities: function clearRemovedEntities() {
	        this.removedEntities = [];
	    },

	    //Getters
	    getEntities: function getEntities() {
	        return this.entities;
	    },

	    getRemovedEntities: function getRemovedEntities() {
	        return this.removedEntities;
	    },

	    getEntityState: function getEntityState(id) {
	        var state = false;

	        if (id === -1) {
	            state = {
	                x: 0,
	                y: 0,
	                mass: 0
	            };
	        }

	        var i = lot.idxOf(this.entities, 'id', id);
	        if (i >= 0) {
	            state = this.entities[i].state;
	        }
	        return state;
	    }
	};

	function FoodController() {
	    EntityController.call(this);
	}
	FoodController.prototype = Object.create(EntityController.prototype);
	FoodController.prototype.add = function (id) {
	    var food = new Food(id, 0);
	    this.entities.push(food);
	    return food;
	};

	function ShootController() {
	    EntityController.call(this);
	}
	ShootController.prototype = Object.create(EntityController.prototype);
	ShootController.prototype.add = function (id) {
	    var shoot = new Shoot(id);
	    this.entities.push(shoot);
	    return shoot;
	};

	function PlayerController() {
	    EntityController.call(this);
	    this.board = [];
	    this.updatedBoard = false;
	}
	PlayerController.prototype = Object.create(EntityController.prototype);
	PlayerController.prototype.add = function (id, name) {
	    var player = new Player(id, name);
	    this.entities.push(player);
	    return player;
	};

	//Setters
	PlayerController.prototype.setBoard = function (board) {
	    this.board = board;
	};

	PlayerController.prototype.setUpdatedBoard = function (updatedBoard) {
	    this.updatedBoard = updatedBoard;
	};

	//Getters
	PlayerController.prototype.getBoard = function () {
	    return this.board;
	};

	PlayerController.prototype.isUpdatedBoard = function () {
	    return this.updatedBoard;
	};

	function Entity(id) {
	    this.id = id;
	    this.state = {};
	    this.updates = [];
	    this.visible = false;
	    this.toRemove = false;
	}
	Entity.prototype = {
	    addUpdate: function addUpdate(state, time) {
	        var newUpdate = new Update(state, time);
	        if (this.updates.length === 0) {
	            this.state = newUpdate.state;
	        }
	        this.updates.push(newUpdate);
	        if (this.updates.length > cfg.clientMaxUpdateBuffer) {
	            this.updates.splice(0, 1);
	        }
	    },

	    //Setters
	    setState: function setState(state) {
	        this.state = state;
	    },

	    setVisible: function setVisible(visible) {
	        this.visible = visible;
	    },

	    setToRemove: function setToRemove(toRemove) {
	        this.toRemove = toRemove;
	    },

	    //Getters
	    getUpdates: function getUpdates() {
	        return this.updates;
	    },

	    getInterpolatedUpdates: function getInterpolatedUpdates(time) {
	        var pos = {};
	        for (var i = 0; i < this.updates.length; i++) {
	            var previous = this.updates[i],
	                target = this.updates[i + 1];
	            if (previous && target && time >= previous.time && time < target.time) {
	                pos.previous = previous;
	                pos.target = target;
	                break;
	            }
	        }
	        return pos;
	    },

	    getId: function getId() {
	        return this.id;
	    },

	    isVisible: function isVisible() {
	        return this.visible;
	    },

	    isToRemove: function isToRemove() {
	        return this.toRemove;
	    }
	};

	function Food(id) {
	    Entity.call(this, id);
	    this.state.movingTime = 0;
	}
	Food.prototype = Object.create(Entity.prototype);

	function Shoot(id) {
	    Entity.call(this, id);
	}
	Shoot.prototype = Object.create(Entity.prototype);

	function Player(id, name) {
	    Entity.call(this, id);
	    this.name = name;
	    this.inputController = 1; //
	}
	Player.prototype = Object.create(Entity.prototype);
	Player.prototype.addUpdate = function (state, time) {
	    var newState = state;
	    if (this.updates.length === 0) {
	        this.state = state;
	    } else {
	        var preState = this.updates[this.updates.length - 1].state;
	        if (state.x === undefined) {
	            newState.x = preState.x;
	        }
	        if (state.y === undefined) {
	            newState.y = preState.y;
	        }
	        if (state.angle === undefined) {
	            newState.angle = preState.angle;
	        }
	        if (state.ring === undefined) {
	            newState.ring = preState.ring;
	        }
	        if (state.mass === undefined) {
	            newState.mass = preState.mass;
	        }
	        if (state.dashing === undefined) {
	            newState.dashing = preState.dashing;
	        }
	    }

	    var newUpdate = new Update(newState, time);
	    this.updates.push(newUpdate);
	    if (this.updates.length > cfg.clientMaxUpdateBuffer) {
	        this.updates.splice(0, 1);
	    }
	};

	function Update(state, time) {
	    this.state = state;
	    this.time = time;
	}

	function Client(socket) {
	    if (cfg.debug) {
	        new Chat(socket);
	    }

	    this.socket = socket;
	    console.log(socket.readyState);
	    this.stateController = new StateController();

	    this.selfId = -1;
	    this.leftSpectator = false;

	    this.handler = {
	        1: this.onMsgSubmit.bind(this),
	        // 1: this.message_onSpectate,
	        10: this.onMsgUpdate.bind(this)
	    };
	    this.handleSocketEvents();
	}

	Client.prototype = {
	    handleSocketEvents: function handleSocketEvents() {
	        this.socket.onmessage = function (msg) {
	            var buf = msg.data;
	            this.handleMessage(buf);
	        }.bind(this);

	        this.onSubmit();

	        this.socket.onclose = function () {
	            // this.onDisconnect();
	        }.bind(this);
	    },

	    handleMessage: function handleMessage(buf) {
	        if (buf.byteLength === 0) return;
	        var view = new DataView(buf);
	        var packetId = view.getUint8(0);
	        if (!this.handler.hasOwnProperty(packetId)) return;
	        this.handler[packetId](buf);
	    },

	    sendMessage: function sendMessage(packet) {
	        // if (this.socket.readyState === 1) {
	        var buf = packet.form();
	        this.socket.send(buf);
	        // } else {
	        //     this.socket.readyState = 3;
	        // }
	    },

	    onSubmit: function onSubmit() {
	        var signForm = document.getElementById("sign-form");
	        var signDivUsername = document.getElementById("signDiv-username");

	        signForm.onsubmit = function (e) {
	            e.preventDefault();
	            this.sendMessage(new Packet.Submit(signDivUsername.value));
	        }.bind(this);
	    },

	    onInput: function onInput(input) {
	        this.sendMessage(new Packet.Input(input));
	    },

	    onMsgSubmit: function onMsgSubmit(msg) {
	        this.clearEntities();
	        var buf = new BufferReader(msg);
	        buf.addOffset(1);
	        var id = buf.getUint16();
	        this.selfId = id;
	        this.leftSpectator = true;
	    },

	    //onUpdate, broadcast loop
	    onMsgUpdate: function onMsgUpdate(msg) {
	        var buf = new BufferReader(msg);
	        buf.addOffset(1);
	        var t = buf.getUint32();
	        this.stateController.setTime(t);

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

	        if (foodsScopeInitFlag) {
	            var lenFoodsScopeInit = buf.getUint16(),
	                foodsScopeInit = [];
	            for (var i = 0; i < lenFoodsScopeInit; i++) {
	                var id = buf.getUint16(),
	                    state = {
	                    movingTime: 0,
	                    angle: 0,
	                    vr: Math.random()
	                };

	                state.xReal = buf.getFloat32();
	                state.yReal = buf.getFloat32();
	                state.x = state.xReal;
	                state.y = state.xReal;
	                foodsScopeInit.push([id, state]);
	            }
	            this.stateController.updateFoodInitStates(foodsScopeInit);
	        }

	        if (foodsScopeRemoveFlag) {
	            var lenFoodsScopeRemove = buf.getUint16(),
	                foodsScopeRemove = [];
	            for (var i = 0; i < lenFoodsScopeRemove; i++) {
	                var id = buf.getUint16();
	                foodsScopeRemove.push(id);
	            }
	            this.stateController.updateFoodRemoveStates(foodsScopeRemove);
	        }

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

	    onDisconnect: function onDisconnect() {
	        this.clearEntities();
	        console.log("closing..");
	        this.socket.close();
	    },

	    clearEntities: function clearEntities() {
	        this.stateController.getPlayerController().clearEntities();
	        this.stateController.getFoodController().clearEntities();
	        this.stateController.getShootController().clearEntities();
	    },

	    //Setters
	    setLeftSpectator: function setLeftSpectator(isLeftSpectator) {
	        this.leftSpectator = isLeftSpectator;
	    },

	    //Getters
	    getStateController: function getStateController() {
	        return this.stateController;
	    },

	    getSelfId: function getSelfId() {
	        return this.selfId;
	    },

	    isLeftSpectator: function isLeftSpectator() {
	        return this.leftSpectator;
	    }
	};

/***/ }

})