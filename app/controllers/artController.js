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

exports.count = () => {
	return Art.count().exec();
};

exports.findNextArt = (count, currentArt) => {
	// Get a random entry
	const random = Math.floor(Math.random() * count);

	// Again query all users but only fetch one offset by our random #
	return Art.findOne({}, 'picture title author desc likes').skip(random).exec();
};

exports.pushLike = (userId, artId) => {
	return Art.findByIdAndUpdate(artId, {
		$push: {
			likes: userId
		}
	}, {new: true}).exec();
};

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
