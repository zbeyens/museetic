const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const ObjectId = mongoose.Schema.ObjectId;

// http://stackoverflow.com/questions/26936645/mongoose-private-chat-message-model
const chatSchema = mongoose.Schema({
    // sender: {
    // 	type: ObjectId,
    // 	ref: 'User'
    // },
    messages: [
        {
            content: String,
            author: {
                type: ObjectId,
                ref: 'User'
            },
            date: {
                type: Date,
                default: Date.now
            }
            // meta: [
            //     {
                    // user: {
                    //     type: ObjectId,
                    //     ref: 'User'
                    // },
                    // delivered : Boolean,
                    // read: Boolean
            //     }
            // ]
        }
    ],
    // is_group_message: {
    // 	type: Boolean,
    // 	default: false
    // },
    participants: [
        {
            user: {
                type: ObjectId,
                ref: 'User'
            },
            read: {
                type: Boolean,
                default: false,
            }
            // delivered: Boolean,
            // last_seen: Date
        }
    ]
});

//compile
module.exports = mongoose.model('Chat', chatSchema);
