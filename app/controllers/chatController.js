const Chat = require('../models/chat');

exports.fetchChats = (userId) => {
    return Chat.find({
        'participants.user': userId
    })
    .populate([
        {
            path: 'messages.author',
            select: 'name'
        }, {
            path: 'participants.user',
            select: 'name'
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

// exports.findArtCurrent = (user) => {
//     return Chat.findById(user._id)
//     .populate({path: 'arts.current'})
//     .exec();
// };
//
// exports.pushChat = (userId, friendId) => {
//     return User.findByIdAndUpdate(userId, {
//         $push: {
//             friendRequests: friendId
//         }
//     }).exec();
// };
