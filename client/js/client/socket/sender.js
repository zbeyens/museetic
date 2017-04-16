const Packet = require('./packet');

exports = module.exports = Sender;

function Sender() {
    this.onSubmit();
}

Sender.prototype = {
    /**
     * form the final packet and send it
     * @param  {Packet}
     * @return {void}
     */
    sendMessage: function(packet) {
        if (this.socket.readyState === 1) {
            const buf = packet.form();
            this.socket.send(buf);
        } else {
            this.onDisconnect();
        }
    },

    /**
     * onSubmit, send the nickname
     * @return {void}
     */
    onSubmit: function() {
        const playForm = document.getElementById("playForm");
        const nickname = document.getElementById("nickname");

        playForm.onsubmit = function(e) {
            e.preventDefault();
            // this.sendMessage(new Packet.Clear());
            this.sendMessage(new Packet.Submit(nickname.value));
        }.bind(this);
    },

    onSubmitted: function() {
        this.sendMessage(new Packet.SubmitACK());
    },

    onInput: function(input) {
        this.sendMessage(new Packet.Input(input));
    },
};
