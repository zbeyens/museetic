const User = require('../models/user');
// const mongoose = require('mongoose');

exports.likeArt = (user, artId, nextArtId) => {
	User.findByIdAndUpdate(user._id, {
		'arts.current': nextArtId,
		$push: {
			"arts.liked": artId
		}
	}, (err, model) => {
		console.log(err);
	});
};

exports.updateArtCurrent = (userId, nextArtId) => {
	return User.findByIdAndUpdate(userId, {
		'arts.current': nextArtId,
		// $push: {
		// 	"arts.liked": artId
		// }
	}).exec();
};

exports.findArtCurrent = (user) => {
	return User.findById(user._id).populate({path: 'arts.current'}).exec();
};
