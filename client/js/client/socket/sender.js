var Packet = require('./packet');

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
            var buf = packet.form();
            this.socket.send(buf);
        } else {
            this.onDisconnect();
        }
    },

    /**
     * onSubmit, send the username
     * @return {void}
     */
    onSubmit: function() {
        var signForm = document.getElementById("sign-form");
        var signDivUsername = document.getElementById("signDiv-username");

        signForm.onsubmit = function(e) {
            e.preventDefault();
            // this.sendMessage(new Packet.Clear());
            this.sendMessage(new Packet.Submit(signDivUsername.value));
        }.bind(this);
    },

    onSubmitted: function() {
        this.sendMessage(new Packet.SubmitACK());
    },

    onInput: function(input) {
        this.sendMessage(new Packet.Input(input));
    },
};
