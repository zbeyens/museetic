const User = require('../models/user');



exports.updateUserArts = (userId, nextArtId, skippedArts) => {
    return User.findByIdAndUpdate(userId, {
        'arts.current': nextArtId,
        'arts.skipped': skippedArts,
    }).exec();
};

exports.findUserArts = (user) => {
    return User.findById(user._id)
    .populate({path: 'arts.current'})
    .exec();
};

/**
* search a user by multiple piece of name
* name can be a sequence of words, match at the beginning or after space
* in any order (used lookahead ?= and bound word \b)
*
* @param  {String} name : Jean Paul
* @return {Promise} users[{id, name}]
*/
exports.searchUsersByName = (name) => {
    const inter = "[^0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+";
    const pureName = name.replace(new RegExp(inter, 'g'), " ");
    const values = pureName.split(" ");
    console.log(values);
    let regex = '';
    for (let i = 0; i < values.length; i++) {
        regex += '(?=.*\\b' + values[i] + ')';
    }
    return User.find({
        name: new RegExp(regex, 'i') //case insensitive
    }, 'name').exec();
};

exports.findUserById = (id) => {
    return User.findById(id, 'dateReg name picture bio profession location gender role friends friendRequests')
    .exec();
};

exports.pushFriendRequest = (userId, friendId) => {
    return User.findByIdAndUpdate(userId, {
        $push: {
            friendRequests: friendId
        }
    }).exec();
};
exports.pullFriendRequest = (userId, friendId) => {
    return User.findByIdAndUpdate(userId, {
        $pull: {
            friendRequests: friendId
        }
    }).exec();
};

exports.fetchNotifications = (id) => {
    return User.findById(id, 'friendRequests')
    .populate({
        path: 'friendRequests',
        select: 'name picture'
    })
    .exec();
};
exports.fetchFriends = (id) => {
    return User.findById(id, 'friends')
    .populate({
        path: 'friends',
        select: 'name picture'
    })
    .exec();
};

exports.acceptFriend = (userId, friendId) => {
    return User.findByIdAndUpdate(userId, {
        $pull: {
            friendRequests: friendId
        },
        $push: {
            friends: friendId
        },
    })
    .exec();
};
exports.declineFriend = (userId, friendId) => {
    return User.findByIdAndUpdate(userId, {
        $pull: {
            friendRequests: friendId
        },
    })
    .exec();
};
exports.removeFriend = (userId, friendId) => {
    return User.findByIdAndUpdate(userId, {
        $pull: {
            friends: friendId
        },
    })
    .exec();
};

exports.addModerator = (userId) => {
    return User.findByIdAndUpdate(userId, {
        role: 'moderator'
    })
    .exec();
};
exports.removeModerator = (userId) => {
    return User.findByIdAndUpdate(userId, {
        role: ''
    })
    .exec();
};

exports.updateUser = (id, values) => {
    return User.findByIdAndUpdate(id, values)
    .exec();
};
