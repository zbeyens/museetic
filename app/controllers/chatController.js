const Chat = require('../models/chat');

//NOTE: I will comment only one time the "new" things. Then it should be trivial.

exports.fetchChats = (userId) => {
    return Chat.find({
        'participants.user': userId
    })
    .populate([
        {
            path: 'messages.author',
            select: 'name picture'
        }, {
            path: 'participants.user',
            select: 'name picture'
        }
    ]).exec();
};

//push a message in an existing chat.
//create a new chat if not existing.
exports.pushMessage = (senderId, receiverId, content) => {
    //reset
    return Chat.findOne({
        $and: [
            {'participants.user': senderId},
            {'participants.user': receiverId}
        ]
    })
    .exec((err, chat) => {
        //existing chat
        if (chat) {
            chat.messages.push({
                content: content,
                author: senderId
            });

            for (let i = 0; i < chat.participants.length; i++) {
                if (!chat.participants[i].user.equals(senderId)) {
                    chat.participants[i].read = false;
                }
            }
            chat.save();
            return chat;
        }

        //new chat
        const newChat = {
            messages: [
                {
                    content: content,
                    author: senderId,
                }
            ],
            participants: [
                {
                    user: senderId,
                    read: true,
                },
                {
                    user: receiverId,
                    read: false,
                }
            ]
        };

        new Chat(newChat).save();
    });
};

//mark the chat as read for one user
exports.readChat = (chatId, userId) => {
    return Chat.findById(chatId)
    .exec((err, chat) => {
        if (chat) {
            for (let i = 0; i < chat.participants.length; i++) {
                if (chat.participants[i].user.equals(userId)) {
                    chat.participants[i].read = true;
                    return chat.save();
                }
            }
        }
    });
};
