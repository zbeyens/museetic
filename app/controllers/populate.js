var Art = require('../models/art'),
    artsData = require('../../config/arts.json');

module.exports = function() {
    //reset
    Art.remove({}, function() {
        console.log("reset");
    });

    //populate
    for (var i = 0; i < artsData.length; i++) {
        new Art(artsData[i]).save();
    }
};
