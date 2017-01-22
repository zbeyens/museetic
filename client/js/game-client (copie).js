// Load modules and use them
//require(['val', 'Canvas', 'Controller'], function(val, Canvas, Controller){

//var UUID = require('node-uuid');
var cfg = require('../../shared/config');
var Canvas = require('./Canvas');
//var Controller = require('./Controller');

var socket = io();
cfg.socket = socket;
// =============================================================================
//  Get everything up and running.
// =============================================================================

// Parameters. Default values will be read from the UI.

// Frame rate of the Client.
var client_fps = 1;

// World update rate of the Server.
var server_fps = undefined;

// Simulated lag between client and server.
var client_server_lag = undefined;

var client_side_prediction = false;
var server_reconciliation = false;

var getRandomNumber = function() {
    var buf = new Uint8Array(1);
    window.crypto.getRandomValues(buf);
    return buf;
}

// Update simulation parameters from UI.
var updateParameters = function() {

    // Client Side Prediction disabled => disable Server Reconciliation.
    if (client_side_prediction && !prediction.checked) {
        reconciliation.checked = false;
    }

    // Server Reconciliation enabled => enable Client Side Prediction.
    if (!server_reconciliation && reconciliation.checked) {
        prediction.checked = true;
    }

    client_side_prediction = prediction.checked;
    server_reconciliation = reconciliation.checked;

    // Reset client update loop.
    client_fps = updateNumberFromUI(client_fps, "client_fps");
    clearInterval(client_interval);
    client_interval = setInterval(updateClient, 1000 / client_fps);

    server_fps = updateNumberFromUI(server_fps, "server_fps");

    client_server_lag = updateNumberFromUI(client_server_lag, "lag");
}

var updateNumberFromUI = function(old_value, element_id) {
    var input = document.getElementById(element_id);
    var new_value = parseInt(input.value);
    if (isNaN(new_value)) {
        new_value = old_value;
    }
    input.value = new_value;
    return new_value;
}

var player_status = document.getElementById("player_status");
var lag = document.getElementById("lag");
var clientfps = document.getElementById("client_fps");
var serverfps = document.getElementById("server_fps");
var prediction = document.getElementById("prediction");
var reconciliation = document.getElementById("reconciliation");

lag.onchange = updateParameters;
clientfps.onchange = updateParameters;
prediction.onchange = updateParameters;
reconciliation.onchange = updateParameters;
serverfps.onchange = updateParameters;

// Read initial parameters from the UI.
updateParameters();

//sign
var signDiv = document.getElementById("signDiv");
var signForm = document.getElementById("sign-form");
var signDivUsername = document.getElementById("signDiv-sername");
var signDivSignIn = document.getElementById("signDiv-signIn");

signForm.onsubmit = function(e) {
    e.preventDefault();
    socket.emit('signIn', {
        username: signDivUsername
    })
}

socket.on('signInReponse', function(data) {
    if (data.success) {
        signDiv.style.display = 'none';
        gameDiv.style.display = 'inline-block';
    } else {
        alert("Sign in unsuccessful")
    }
});

//chat
var chatText = document.getElementById("chat-text");
var chatInput = document.getElementById("chat-input");
var chatForm = document.getElementById("chat-form");
socket.on('addToChat', function(data) {
    chatText.innerHTML += '<div>' + data + '</div>';
});
socket.on('evalAnswer', function(data) {
    console.log(data);
});
chatForm.onsubmit = function(e) {
    e.preventDefault();
    if (chatInput.value[0] === '/') {
        //on envoie la commande sans le '/'
        socket.emit('evalServer', chatInput.value.slice(1));
    } else {
        socket.emit('sendMsgToServer', chatInput.value);
    }
    chatInput.value = '';
}


//game
var Img = {};
Img.player = new Image();
Img.player.src = '/client/img/flappy.png';
Img.bullet = new Image();
//Img.bullet.src = '/client/img/bullet.png';
Img.bullet.src = '/client/img/poop.png';
Img.map = new Image();
Img.map.src = '/client/img/clouds.jpg';

var canvas = new Canvas();
var cv = canvas.cv;
var ctx = canvas.ctx;

//var ctrl = new Controller();

var selfId = null;

//Contents : [i: {recv_ts, payload}]
//push : socket.on
//splice : update, receive
var messages = [];

// Input state (processInputs)
var key_left = false;
var key_right = false;
var key_up = false;
var key_down = false;
var click = false;
var angle = 0;
//var bullet_id = UUID();

var last_ts = undefined;
// Contents : Data needed for reconciliation.
// ++/push : update, processInputs
var input_sequence_number = 0;
// Contents : [i: input]
// push : update, processInputs
// splice : update, processUpdatePack // empty if no reconciliation
var pending_inputs = [];

var Entity = function() {
    var self = {
        spdX: 0,
        spdY: 0,
        id: "",
    }
    self.update = function() {
        self.updatePosition();
    }
    self.updatePosition = function() {
        self.x += self.spdX;
        self.y += self.spdY;
    }
    self.getDistance = function(pt) {
        return Math.sqrt(Math.pow(self.x - pt.x, 2) + Math.pow(self.y - pt.y, 2));
    }
    return self;
}

var Player = function(initPack) {
    var self = Entity();

    self.x = initPack.x;
    self.y = initPack.y;

    self.id = initPack.id;
    self.name = initPack.name;

    self.dead = initPack.dead;
    self.mass = initPack.mass;
    self.maxSpd = initPack.maxSpd;

    var super_update = self.update;

    //PREDICTION
    self.applyInput = function(input) {
        if (input.type === 'mouse_down') {
            self.shootBullet(input.angle);
        } else {
            if (input.type === 'down' || input.type === 'up') {
                self.spdY = input.press_time * self.maxSpd;
            } else if (input.type === 'left' || input.type === 'right') {
                self.spdX = input.press_time * self.maxSpd;
            }
            super_update();
            self.spdX = 0;
            self.spdY = 0;
        }
    }
    self.shootBullet = function(angle) {
        var b = BulletRender(self.id, angle);
    }

    self.draw = function() {
        //hp bar
        var width = Img.player.width;
        var height = Img.player.height;

        var playerWidth = width + 10 * self.mass;
        var playerHeight = height + 10 * self.mass;

        var x = self.x - Player.list[selfId].x + cfg.screenWidth / 2;
        var y = self.y - Player.list[selfId].y + cfg.screenHeight / 2;

        //center and size
        ctx.drawImage(Img.player, x - playerWidth / 2, y - playerHeight / 2, playerWidth, playerHeight);
        //ctx.fillText(self.name,self.x,self.y);
    }

    Player.list[self.id] = self;
    return self;
}
Player.list = {};

//directly render the client Bullet
var BulletRender = function(parent, angle) {
    var self = Entity();
    self.id = Math.random(); //!!

    //PREDICTION
    self.x = Player.list[parent].x;
    self.y = Player.list[parent].y;
    self.parent = parent;
    self.angle = angle;
    self.maxSpd = 200;

    self.timer = 0; //+1 par frame
    self.toRemove = false;
    var super_update = self.update;
    self.update = function(dt_sec) {
        self.timer += dt_sec;
        if (self.timer > 3) {
            self.toRemove = true;
        }
        self.spdX = Math.cos(angle) * dt_sec * self.maxSpd;
        self.spdY = Math.sin(angle) * dt_sec * self.maxSpd;
        super_update();

        for (var i in Player.list) {
            var p = Player.list[i];
            if (self.getDistance(p) < (34 + 3 * p.mass) && self.parent !== p.id) {
                //handle collision (dead)
                /*p.dead = true;
                p.x = Math.random() * 288;
                p.y = Math.random() * 506;

                //if disconnect, no points/mass given
                var shooter = Player.list[self.parent];
                if (shooter) {
                    shooter.mass += 1;
                }
                */

                self.toRemove = true;
            }
        }
    }


    self.draw = function() {
        //var width = Img.bullet.width*2;
        //var height = Img.bullet.height*2;
        var width = 32;
        var height = 32;

        var x = self.x - Player.list[selfId].x + cfg.screenWidth / 2;
        var y = self.y - Player.list[selfId].y + cfg.screenHeight / 2;

        ctx.drawImage(Img.bullet, 0, 0, Img.bullet.width, Img.bullet.height, x - width / 2, y - height / 2, width, height); //center and
    }

    BulletRender.list[self.id] = self;
    return self;
}
BulletRender.list = {};

//receive and render the other client Bullet
var Bullet = function(initPack) {
    var self = Entity();
    self.id = initPack.id;

    self.x = initPack.x;
    self.y = initPack.y;
    self.parent = initPack.parent;

    self.draw = function() {
        //var width = Img.bullet.width*2;
        //var height = Img.bullet.height*2;
        var width = 32;
        var height = 32;

        var x = self.x - Player.list[selfId].x + cfg.screenWidth / 2;
        var y = self.y - Player.list[selfId].y + cfg.screenHeight / 2;

        ctx.drawImage(Img.bullet, 0, 0, Img.bullet.width, Img.bullet.height, x - width / 2, y - height / 2, width, height); //center and
    }

    Bullet.list[self.id] = self;
    return self;
}
Bullet.list = {};


// =============================================================================
// Socket
// =============================================================================

socket.on('init', function(data) {
    messages.push({
        recv_ts: +new Date() + client_server_lag,
        payload: data
    });
});

socket.on('update', function(data) {
    messages.push({
        recv_ts: +new Date() + client_server_lag,
        payload: data
    });
});

socket.on('remove', function(data) {
    messages.push({
        recv_ts: +new Date() + client_server_lag,
        payload: data
    });
});


// =============================================================================
//  Client update loop
// =============================================================================

var updateClient = function() {
    update();
}

var update = function() {
    // Listen to the server.
    processServerMessages();

    if (!selfId) return;

    // Process inputs.
    processInputs();

    renderWorld();

    // Show some info.
    var info = "Non-acknowledged inputs: " + pending_inputs.length;
    player_status.textContent = info;
}


// Process all messages from the server, i.e. world updates.
// If enabled, do server reconciliation.
var processServerMessages = function() {
    while (true) {
        var message = receive();
        if (!message) { //} || !message.pack.player.id) {
            break;
        }

        var pack = message.pack;

        // World state is lists of entity states.
        if (message.type === 'init') {
            processInitPack(pack);
        } else if (message.type === 'update') {
            processUpdatePack(pack);
        } else if (message.type === 'remove') {
            processRemovePack(pack);
        }
    }
}

var receive = function() {
    var now = +new Date();
    for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        if (message.recv_ts <= now) {
            messages.splice(i, 1);
            return message.payload;
        }
    }
}

var processInitPack = function(initPack) {
    //client just arrived
    if (initPack.selfId) {
        selfId = initPack.selfId;
    }
    //init newer clients
    for (var i = 0; i < initPack.player.length; i++) {
        new Player(initPack.player[i]);
    }
    for (var i = 0; i < initPack.bullet.length; i++) {
        new Bullet(initPack.bullet[i]);
    }
}

var processUpdatePack = function(updatePack) {
    for (var i = 0; i < updatePack.player.length; i++) {
        var pack = updatePack.player[i];
        var p = Player.list[pack.id];
        if (p) {
            if (pack.x !== undefined) {
                p.x = pack.x;
            }
            if (pack.y !== undefined) {
                p.y = pack.y;
            }
            if (pack.dead !== undefined) {
                p.dead = pack.dead;
            }
            if (pack.mass !== undefined) {
                p.mass = pack.mass;
            }
        }

        if (pack.id === selfId) {
            if (server_reconciliation) {
                // Server Reconciliation. Re-apply all the inputs not yet processed by
                // the server.
                var j = 0;
                while (j < pending_inputs.length) {
                    var input = pending_inputs[j];
                    if (input.input_sequence_number <= pack.last_processed_input) {
                        // Already processed. Its effect is already taken into account
                        // into the world update we just got, so we can drop it.
                        pending_inputs.splice(j, 1);
                    } else {
                        // Not processed by the server yet. Re-apply it.
                        Player.list[selfId].applyInput(input);
                        j++;
                    }
                }
            } else {
                // Reconciliation is disabled, so drop all the saved inputs.
                pending_inputs = [];
            }
        }
    }
    for (var i = 0; i < updatePack.bullet.length; i++) {
        var pack = updatePack.bullet[i];
        var b = Bullet.list[pack.id];
        if (b) {
            if (pack.x !== undefined) {
                b.x = pack.x;
            }
            if (pack.y !== undefined) {
                b.y = pack.y;
            }
        }
    }
}

var processRemovePack = function(removePack) {
    for (var i = 0; i < removePack.player.length; i++) {
        delete Player.list[removePack.player[i]];
    }
    for (var i = 0; i < removePack.bullet.length; i++) {
        delete Bullet.list[removePack.bullet[i]];
    }
}

// Get inputs and send them to the server.
// If enabled, do client-side prediction.
var processInputs = function() {
    //DEBUG
    socket.emit('server_fps', server_fps);

    // Compute delta time since last update. !don't send!
    var now_ts = +new Date();
    last_ts = last_ts || now_ts;
    var dt_sec = (now_ts - last_ts) / 1000.0;
    last_ts = now_ts;

    // Package player's input.
    var mouseinput = undefined;
    if (click) {
        mouseinput = {
            type: 'mouse_down',
            angle: angle
        };
        mouseinput.input_sequence_number = input_sequence_number++;
        mouseinput.id = selfId;
        socket.emit('mousePress', {
            lag_ms: client_server_lag,
            message: mouseinput
        });
        //socket.emit('mousePress', {lag_ms:0, message:mouseinput});
        click = false;

        // Save this input for later reconciliation.
        //pending_inputs.push(mouseinput);
    }

    var input = undefined;
    if (key_right) {
        input = {
            type: 'right',
            press_time: dt_sec
        };
    } else if (key_left) {
        input = {
            type: 'left',
            press_time: -dt_sec
        };
    } else if (key_down) {
        input = {
            type: 'down',
            press_time: dt_sec
        };
    } else if (key_up) {
        input = {
            type: 'up',
            press_time: -dt_sec
        };
    }

    if (input) {
        // Send the input to the server.
        input.input_sequence_number = input_sequence_number++;
        input.id = selfId;
        socket.emit('keyPress', {
            lag_ms: client_server_lag,
            message: input
        });

        // Save this input for later reconciliation.
        pending_inputs.push(input);
    }


    // Do client-side prediction.
    if (client_side_prediction) {
        if (input) {
            Player.list[selfId].applyInput(input);
        }

        if (mouseinput) {
            Player.list[selfId].applyInput(mouseinput);
        }

        for (var i in BulletRender.list) {
            var bullet = BulletRender.list[i];

            BulletRender.list[i].update(dt_sec);
            if (BulletRender.list[i].toRemove) {
                delete BulletRender.list[i];
            }
        }
    }

}

var renderWorld = function() {
    ctx.clearRect(0, 0, cfg.screenWidth, cfg.screenHeight); //

    drawMap();
    drawScore();
    for (var i in Player.list) {
        Player.list[i].draw();
    }
    for (var i in Bullet.list) {
        //draw the ennemy Bullet
        if (Bullet.list[i].parent !== selfId || !client_side_prediction) {
            Bullet.list[i].draw();
        }
    }
    for (var i in BulletRender.list) {
        //draw my Bullet
        BulletRender.list[i].draw();
    }
}

var drawMap = function() {
    var x = cfg.screenWidth / 2 - Player.list[selfId].x;
    var y = cfg.screenHeight / 2 - Player.list[selfId].y;
    var pat = ctx.createPattern(Img.map, "repeat");
    ctx.fillStyle = pat;
    ctx.drawImage(Img.map, x, y);
}

var drawScore = function() {
    ctx.fillStyle = 'black';
    ctx.fillText(Player.list[selfId].mass, 0, 30);
}


var mouseHandler = function(e) {
    e = e || window.event; //?
    click = (e.type == 'click');

    var mouseX = e.pageX - cv.offsetLeft;
    var mouseY = e.pageY - cv.offsetTop;

    var x = -cfg.screenWidth / 2 + mouseX;
    var y = -cfg.screenHeight / 2 + mouseY;
    angle = Math.atan2(y, x);
}
cv.onclick = mouseHandler;

// When the player presses the right or left arrow keys, set the corresponding
// flag in the Client.
var keyHandler = function(e) {
    e = e || window.event; //?
    if (e.keyCode == 68) {
        key_right = (e.type == "keydown");
    } else if (e.keyCode == 81) {
        key_left = (e.type == "keydown");
    } else if (e.keyCode == 90) {
        key_up = (e.type == "keydown");
    } else if (e.keyCode == 83) {
        key_down = (e.type == "keydown");
    }
}
document.body.onkeydown = keyHandler;
document.body.onkeyup = keyHandler;

var client_interval = setInterval(updateClient, 1000 / client_fps);


//});
