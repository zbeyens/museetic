var express = require('express'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    http = require('http'),
    // https = require('https'),
    path = require('path'),
    fs = require('fs'),
    app = express();

app.use(logger('dev'));
app.use('/client', express.static(path.join(__dirname, '/client')));
app.use(bodyParser.json()); //support json-encoded bodies
app.use(bodyParser.urlencoded({
    extended: false
})); //support url-encoded bodies


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});


// app.param('name', function(req, res, next, name) {
//     // check if the user with that name exists
//     // do some validations
//     req.name = "Hello " + name + '-dude';
//     next();
// });
//
// app.get('/:name', function(req, res) {
//     res.send(req.name);
// });

app.post('/sms', function(req, res) {
    res.send(req.body.name);
});

// var options = {
//     key: fs.readFileSync(path.join(__dirname, 'key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
// };
// var server = https.createServer(options, app);

var server = http.createServer(app);
server.listen(process.env.PORT || 3000, function() {
    console.log('Listening on http://localhost:' + (process.env.PORT || 3000));
});
