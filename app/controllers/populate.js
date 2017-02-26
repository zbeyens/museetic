const Art = require('../models/art'),
    artsData = require('../../config/arts.json');

module.exports = function() {
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
