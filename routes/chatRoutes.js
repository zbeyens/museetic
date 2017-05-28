// const async = require('async');
// const userController = require('../app/controllers/userController'),
const chatController = require('../app/controllers/chatController');
// validator = require('validator'),
// async = require('async');

module.exports = (app, isLoggedIn) => {
    app.get('/fetchChats', isLoggedIn, (req, res) => {
        const fetchChats = chatController.fetchChats(req.user.id);
        fetchChats.then((chats) => {
            res.send(chats);
        }).catch((err) => {
            res.sendStatus(500);
        });
    });

    //POST
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

    app.post('/readChat', isLoggedIn, (req, res) => {
        const msg = req.body;
        console.log(msg);
        const readChat = chatController.readChat(msg.id, req.user.id);
        readChat.then((chat) => {
            res.sendStatus(200);
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    });
};
