const Art = require('../models/art'),
artsData = require('../../config/arts.json');

//dev
exports.resetArts = () => {
    //reset
    Art.remove({}, () => {
        console.log("reset");
    });

    //populate
    let i;
    for (i = 0; i < artsData.length; i++) {
        new Art(artsData[i]).save();
    }
};

exports.findById = (id) => {
    return Art.findById(id, 'picture title author desc likes').exec();
};

exports.count = () => {
    return Art.count().exec();
};

exports.findNextArt = (count, currentArt) => {
    // Get a random entry
    const random = Math.floor(Math.random() * count);

    // Again query all users but only fetch one offset by our random #
    return Art.findOne({}, 'picture title author desc likes').skip(random).exec();
};

//NOTE: select...
exports.pushLike = (userId, artId) => {
    return Art.findByIdAndUpdate(artId, {
        $push: {
            likes: userId
        }
    }, {new: true}).exec();
};

//NOTE: select...
exports.pullLike = (userId, artId) => {
    return Art.findByIdAndUpdate(artId, {
        $pull: {
            likes: userId
        }
    }, {new: true}).exec();
};

exports.findLike = (userId, artId) => {
    return Art.find({
        _id: artId,
        likes: userId
    }, '').exec();
};

exports.findByLikes = (userId) => {
    return Art.find({
        likes: userId
    }, 'picture title author desc likes').exec();
};

//NOTE: pic
exports.fetchComments = (id) => {
    return Art.findById(id, 'comments')
    .populate({
        path: 'comments.author',
        select: 'name'
    }).exec();
};

//NOTE: pic
exports.pushComment = (userId, artId, content) => {
    const com = {
        author: userId,
        content: content,
    };
    return Art.findByIdAndUpdate(artId, {
        $push: {
            comments: com
        }
    }, {
        new: true,
        select: 'comments',
    }).populate({
        path: 'comments.author',
        select: 'name'
    }).exec();
};


exports.pullComment = (userId, artId, comId) => {
    return Art.findByIdAndUpdate(artId, {
        $pull: {
            comments: {
                _id: comId,
                author: userId,
            }
        }
    }, {
        new: true,
        select: 'comments',
    }).populate({
        path: 'comments.author',
        select: 'name'
    }).exec();
};
