var express = require('express'),
    app = express(),
    server = require('http').createServer(),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        server: server
    }),
    path = require('path'),
    cfgs = require('./config'),
    helmet = require('helmet');

var utf8 = unescape(encodeURIComponent('【≽ܫ≼】'));
var code = [];
for (var i = 0; i < utf8.length; i++) {
    code.push(utf8.charCodeAt(i));
}
var name;
try {
    name = decodeURIComponent(escape(String.fromCharCode.apply(null, code)));
    console.log(name);
} catch (e) {}
console.log(name.length);

// wss = new WebSocketServer({
//     port: 3000
// });
var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;


// var id = 0;
// if (cluster.isWorker) {
//     id = cluster.worker.id;
// }
// var iterations = 1000000000;
// setTimeout(function() {
//     console.time('Function #' + id);
//     for (var i = 0; i < iterations; i++) {
//         var test = 0;
//     }
//     console.timeEnd('Function #' + id);
// }, 0);

if (cluster.isMaster) {
    // var worker1 = cluster.fork();
    // var worker2 = cluster.fork();
    // var worker3 = cluster.fork();
    // var worker4 = cluster.fork();


    // startTestGame(worker1, worker2, worker3, worker4);

} else if (cluster.isWorker) {
    process.on('message', (message) => {
        if (message.msg === 'updateClients') {
            updateClients(message.begin, message.end);
        }
    });
}

function startTestGame(worker1, worker2, worker3, worker4) {
    worker1.send({
        msg: 'updateClients',
        begin: 0,
        end: 1000000000 / 4
    });
    worker2.send({
        msg: 'updateClients',
        begin: 0,
        end: 1000000000 / 4
    });
    worker3.send({
        msg: 'updateClients',
        begin: 0,
        end: 1000000000 / 4
    });
}

function updateClients(begin, end) {
    var id = cluster.worker.id;
    console.time('Function #' + id);
    for (var i = Number(begin); i < end; i++) {
        var test = 0;
    }
    console.timeEnd('Function #' + id);
}


app.set('gameport', 4000);
app.use(helmet());
app.use('/client', express.static(path.join(__dirname, '/client')));
app.use('/shared', express.static(path.join(__dirname, '/shared')));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});


server.on('request', app);
server.listen(app.get('gameport'), function() {
    console.log('Listening on port ' + app.get('gameport'));
});

//var io = server.listen(server);
var b = [1, 1, 1, 1, 1, 1, 1, 1];

var toByte = function(arr) {
    var byte = 0;
    for (var i = 0; i < 8; i++) {
        if (arr[i]) {
            byte |= 1 << i;
        }
    }
    return byte;
};
console.log(toByte(b));

var fromByte = function(byte) {
    var arr = new Array(8);
    for (var i = 0; i < 5; i++) {
        arr[i] = (byte & (1 << i)) !== 0;
    }
    return arr;
};
console.log(fromByte(255)[7]);


wss.on('connection', function(socket) {
    var buffer = new ArrayBuffer(16);
    var dv = new DataView(buffer);
    dv.setInt16(1, 0.42, true);

    socket.send(buffer, {
        binary: true
    });

    socket.on('message', function(message, flags) {
        function toArrayBuffer(buf) {
            return new Uint8Array(buf).buffer;
        }

        var buf = toArrayBuffer(message);
        var view = new DataView(buf);
        console.log(view.getUint8(0));

        if (buf instanceof ArrayBuffer) {
            console.log('yo');

        }
        // data = JSON.parse(data);
        // if (data.packet === "signIn") {
        //     console.log('signIn received');
        // }
    });
});
