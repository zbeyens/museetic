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

//take a pic and put it in uploads.
// app.use(multer({
//     dest: path.join(__dirname, '/client/img/uploads'),
//     rename: function(fieldname, filename) {
//         return filename;
//     },
// }));
// app.post(‘/api/photo’,function(req,res){
//  var newItem = new Item();
//  newItem.img.data = fs.readFileSync(req.files.userPhoto.path)
//  newItem.img.contentType = ‘image/png’;
//  newItem.save();
// });

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
server.listen(process.env.PORT || 5000, function() {
    console.log('Listening on http://localhost:' + (process.env.PORT || 5000));
});
