const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt-nodejs');
const ObjectId = mongoose.Schema.ObjectId;


const userSchema = mongoose.Schema({
	arts: {
		current: {
			type: ObjectId,
			ref: 'Art'
		},
		skipped: [
			{
				type: ObjectId,
				ref: 'Art'
			}
		],
	},
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role: String, //admin, manager
    friends: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    friendRequests: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    dateReg: {
        type: Date,
        default: Date.now
    },
	local: {
		password: {
			type: String,
			required: true
		}
	},
	facebook: {
		id: String,
		token: String,
		picture: String
	},
	google: {
		id: String,
		token: String,
	},
});

// generating a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

//compile
module.exports = mongoose.model('User', userSchema);
