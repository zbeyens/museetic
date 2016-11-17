exports = module.exports = Database;

function Database(mongoose) {
    var uristring = 'mongodb://localhost/museetic';

    // Makes connection asynchronously.  Mongoose will queue up database
    // operations and release them when the connection is complete.
    mongoose.Promise = global.Promise;
    mongoose.connect(uristring, function(err, res) {
        if (err) {
            console.log('ERROR connecting to: ' + uristring + '. ' + err);
        } else {
            console.log('Succeeded connected to: ' + uristring);
        }
    });
}

Database.prototype = {};
