const chatController = require('../app/controllers/chatController');

module.exports = (app, isLoggedIn) => {
    //if logged in, fetch all the chats from the user id.
    app.get('/fetchChats', isLoggedIn, (req, res) => {
        const fetchChats = chatController.fetchChats(req.user.id);
        fetchChats.then((chats) => {
            res.send(chats);
        }).catch((err) => {
            res.sendStatus(500);
        });
    });

    //POST
    //if logged in, push a message content in a chat from sender and recv id
    app.post('/sendChatMessage', isLoggedIn, (req, res) => {
        const msg = req.body;
        const pushMessage = chatController.pushMessage(req.user.id, msg.destUserId, msg.content);
        pushMessage.then((chat) => {
            res.sendStatus(200);
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    });

    //if logged in, put the chat as read from the user id
    app.post('/readChat', isLoggedIn, (req, res) => {
        const msg = req.body;
        const readChat = chatController.readChat(msg.id, req.user.id);
        readChat.then((chat) => {
            res.sendStatus(200);
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    });
};
