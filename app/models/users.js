var mongoose = require('mongoose');

var userSchema = mongoose.Schema({

    local: {
        email: String,
        password: String,
    },
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String,
        picture: String,
        dateReg: {
            type: Date,
            'default': Date.now
        }
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }

});

module.exports = mongoose.model('User', userSchema);
