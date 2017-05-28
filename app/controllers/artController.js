const Art = require('../models/art'),
Museum = require('../models/museum'),
artsData = require('../../config/arts.json');
//NOTE: async useless, use .then

//dev
exports.resetArts = () => {
    //reset
    Art.remove({}, () => {
        console.log("reset");

        //populate
        let i;
        for (i = 0; i < artsData.length; i++) {
            new Art(artsData[i]).save((err, newArt) => {
                if (err) console.log(err);

                console.log("cool ");
                const findMuseum = Museum.findOneAndUpdate({
                    name: newArt.museumName
                }, {
                    $push: {
                        arts: newArt._id
                    }
                }).exec();

                findMuseum.then((museum) => {
                    console.log(museum);
                    return Art.updateMany({
                        museumName: museum.name
                    }, {
                        museum: museum._id
                    }).exec();
                });
            });
        }
    });
};

exports.findById = (id) => {
    return Art.findById(id, 'picture title subtitle abstract desc likes museum')
    .populate({
        path: 'museum',
        select: 'name'
    })
    .exec();
};

exports.count = () => {
    return Art.count().exec();
};

exports.findNextArt = (count, artProfile, skippedArts) => {
    // Get a random entry
    const random = Math.floor(Math.random() * (count - skippedArts.length));

    // Again query all users but only fetch one offset by our random #
    return Art.findOne({
        _id: {
            $nin: skippedArts
        }
    }, 'picture title subtitle abstract desc likes')
    .skip(random)
    .exec();
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
    }, 'picture title subtitle abstract museum desc likes')
    .populate({
        path: 'museum',
        select: 'name picture'
    }).exec();
};

//NOTE: pic
exports.fetchComments = (id) => {
    return Art.findById(id, 'comments')
    .populate({
        path: 'comments.author',
        select: 'name picture'
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
        select: 'name picture'
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
        select: 'name picture'
    }).exec();
};

exports.pushArt = (values) => {
    return new Art(values).save();
};

exports.updateArt = (id, values) => {
    return Art.findByIdAndUpdate(id, values)
    .exec();
};

exports.removeArt = (id) => {
    return Art.findByIdAndRemove(id)
    .exec();
};
