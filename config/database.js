exports = module.exports = Database;

function Database(mongoose) {
    var url = 'mongodb://localhost/museetic';

    // Makes connection asynchronously.  Mongoose will queue up database
    // operations and release them when the connection is complete.
    mongoose.Promise = global.Promise;
    mongoose.connect(url, function(err, res) {
        if (err) {
            console.log('ERROR connecting to: ' + url + '. ' + err);
        } else {
            console.log('Succeeded connected to: ' + url);
        }
    });
}

Database.prototype = {};
