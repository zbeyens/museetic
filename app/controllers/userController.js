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
    }, {
        name: 1
    }).exec();
};
