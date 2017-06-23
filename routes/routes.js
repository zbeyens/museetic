const path = require('path'),
authRoutes = require('./authRoutes'),
userRoutes = require('./userRoutes'),
artRoutes = require('./artRoutes'),
museumRoutes = require('./museumRoutes'),
chatRoutes = require('./chatRoutes');
const multer = require('multer'),
crypto = require('crypto');

/**
 * this configurate where to put pictures, with random bytes generated for the name
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../client/img/uploads/'));
    },
    filename: (req, file, cb) => {
        //rename here
        crypto.pseudoRandomBytes(16, (err, raw) => {
            cb(null, raw.toString('hex') + path.extname(file.originalname));
        });
        // cb(null, file.fieldname + '-' + Date.now());
    }
});
// specify the limits and the storage
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }
});

//check whether the user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (!req.isAuthenticated()) {
        return res.sendStatus(403);
    }

    return next();
}

//check whether the user is moderator or admin
function isModerator(req, res, next) {
    if (!(req.user.role === 'admin' || req.user.role === 'moderator')) {
        return res.sendStatus(403);
    }

    return next();
}


module.exports = (app, passport) => {
    authRoutes(app, passport, isLoggedIn);
    artRoutes(app, isLoggedIn, isModerator, upload);
    museumRoutes(app, isLoggedIn, isModerator, upload);
    userRoutes(app, isLoggedIn, isModerator, upload);
    chatRoutes(app, isLoggedIn);

    //Main file - after all routing
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../index.html'));
    });
};
