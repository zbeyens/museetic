const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({

    global: {
        dateReg: {
            type: Date,
            'default': Date.now
        }
    },
    local: {
        name: String,
        email: String,
        password: String,
    },
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String,
        picture: String,
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }

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
