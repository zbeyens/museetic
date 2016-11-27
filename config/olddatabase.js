var pg = require('pg');

exports = module.exports = Database;

function Database() {
    var url = "pg://postgres:postgres@localhost:5432/museetic";

    this.client = new pg.Client(url);
    // connect to our database
    this.client.connect();
    // execute a query on our database
    // client.query("INSERT INTO users(name) values($1)", ['Tinniam']);
}

Database.prototype = {
    findOne: function(id, next) {
        var sql = "SELECT * FROM users WHERE 'facebookID' = $1";
        var query = this.client.query(sql, [id]);
        query.on('row', function(row) {
            console.log(row);
        });


        // just print the result to the console
        // query.on('end', function() {
        //     client.end();
        // });
        next();
    },

    addUser: function(profile, token) {
        var sql = "INSERT INTO users(name, 'facebookID', token) values($1, $2, $3)";
        client.query(sql, [profile.name.familyName, profile.id, token]);
        // set all of the facebook information in our user model
        // newUser.facebook.id = profile.id; // set the users facebook id
        // newUser.facebook.token = token; // we will save the token that facebook provides to the user
        // newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
        // newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

    }
};
