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
	return Art.findOne({}, 'picture title desc').skip(random).exec();
};
