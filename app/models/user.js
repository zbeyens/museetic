const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt-nodejs');
const ObjectId = mongoose.Schema.ObjectId;

//User schema.
//Facebook and google are not used for the moment.
const userSchema = mongoose.Schema({
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
    bio: String,
    picture: String,
    location: String,
    profession: String,
    gender: String,
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
    museums: [
        {
            type: ObjectId,
            ref: 'Museum'
        }
    ],
    role: String, //admin, moderator
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

// generating a hash from a password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid for authenticating.
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

//compile
module.exports = mongoose.model('User', userSchema);
