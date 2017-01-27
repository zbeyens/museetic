exports = module.exports = Chat;

function Chat(socket) {
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
    };
}
