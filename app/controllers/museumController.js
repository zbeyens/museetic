const Museum = require('../models/museum'),
museumsData = require('../../config/museums.json');

//dev
exports.resetMuseums = () => {
    //reset
    Museum.remove({}, () => {
        console.log("reset museums");
    });

    //populate
    let i;
    for (i = 0; i < museumsData.length; i++) {
        new Museum(museumsData[i]).save().then();
    }
};

//all museums
exports.findAll = () => {
    return Museum.find({}, 'picture name')
    .exec();
};

exports.findById = (id) => {
    return Museum.findById(id)
    .populate({
        path: 'arts',
        select: 'picture title museum',
        populate: {
            path: 'museum',
            select: 'name',
        }
    })
    .exec();
};

exports.updateMuseum = (id, values) => {
    return Museum.findByIdAndUpdate(id, values)
    .exec();
};

exports.pushArtToMuseum = (artId, museumId) => {
    return Museum.findByIdAndUpdate(museumId, {
        $push: {
            arts: artId
        }
    })
    .exec();
};

exports.pushMuseum = (values) => {
    return new Museum(values).save();
};

exports.removeMuseum = (id) => {
    return Museum.findByIdAndRemove(id)
    .exec();
};
