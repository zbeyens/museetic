const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const ObjectId = mongoose.Schema.ObjectId;

const museumSchema = mongoose.Schema({
    picture: String,
    name: String,
    url: String,
    address: String,
    tel: String,
    fax: String,
    open: String,
    close: String,
    tarif: String,
    desc: String,
    moderator: {
        type: ObjectId,
        ref: 'User'
    },
    arts: [
        {
            type: ObjectId,
            ref: 'Art'
        }
    ],
    date: {
		type: Date,
		default: Date.now
	},
});

//compile
module.exports = mongoose.model('Museum', museumSchema);
