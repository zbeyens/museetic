var Packet = require('./packet');

exports = module.exports = Sender;

function Sender() {}

Sender.prototype = {
    sendMessage: function(socket, packet) {
        if (socket.readyState === 1) {
            var buf = packet.form();
            // console.log(buf);
            socket.send(buf, {
                binary: true
            });
        } else {
            socket.close();
        }
    },
};
