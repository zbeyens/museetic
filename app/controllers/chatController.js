const Chat = require('../models/chat');

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
