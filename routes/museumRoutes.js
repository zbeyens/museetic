const path = require('path');
const cfg = require('../shared/config');
const fs = require('fs');

const museumController = require('../app/controllers/museumController');
const artController = require('../app/controllers/artController');
// userController = require('../app/controllers/userController'),
// async = require('async');

module.exports = (app, isLoggedIn, isModerator, upload) => {
    // const isProduction = process.env.NODE_ENV === 'production';

    //NOTE: better error handling...
    // if (!isProduction) {
    app.get('/museumpopulate', isModerator, (req, res) => {
        museumController.resetMuseums();
        res.redirect("/");
    });


    app.get('/fetchMuseum', (req, res) => {
        const museumId = req.query.id;

        const findById = museumController.findById(museumId);
        findById.then((museum) => {
            res.send(museum);
        }).catch((err) => {
            res.sendStatus(500);
        });
    });

    app.get('/fetchAllMuseums', (req, res) => {
        const findAll = museumController.findAll();
        findAll.then((museums) => {
            res.send(museums);
        }).catch((err) => {
            res.sendStatus(500);
        });
    });

    app.post('/addMuseum', isLoggedIn, isModerator, upload.single('picture'), (req, res) => {
        const values = req.body;

        //NOTE: should limit values
        // console.log(values);
        // console.log(req.file);
        if (req.file) {
            values.picture = '/client/img/uploads/' + req.file.filename;
        } else {
            values.picture = cfg.defaultPicMuseum;
        }
        values.moderator = req.user.id;

        // res.sendStatus(200);
        const pushMuseum = museumController.pushMuseum(values);
        pushMuseum.then((museum) => {
            res.send(museum._id);
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    });

    app.post('/editMuseum', isLoggedIn, isModerator, upload.single('picture'), (req, res) => {
        const id = req.body.id;
        const msg = req.body;

        const values = {};
        values.name = msg.name ? msg.name : '';
        values.address = msg.address ? msg.address : '';
        values.desc = msg.desc ? msg.desc : '';
        values.url = msg.url ? msg.url : '';
        values.tel = msg.tel ? msg.tel : '';
        values.fax = msg.fax ? msg.fax : '';
        values.open = msg.open ? msg.open : '';
        values.close = msg.close ? msg.close : '';
        values.tarif = msg.tarif ? msg.tarif : '';

        const findById = museumController.findById(id);
        findById.then((museum) => {
            //edit only if uploaded file
            if (req.file) {
                if (museum.picture && museum.picture !== cfg.defaultPicMuseum) {
                    //check if previous file exists
                    const prevPicture = path.join(__dirname, '/..', museum.picture);
                    fs.stat(prevPicture, (err, stats) => {
                        if (err) {
                            return console.error(err);
                        }
                        //delete previous file
                        fs.unlink(prevPicture);
                    });
                }
                values.picture = '/client/img/uploads/' + req.file.filename;
            }

            const updateMuseum = museumController.updateMuseum(id, values);
            updateMuseum.then(() => {
                res.sendStatus(200);
            }).catch((err) => {
                res.sendStatus(500);
                console.log(err);
            });
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    });

    app.post('/removeMuseum', isLoggedIn, isModerator, (req, res) => {
        const id = req.body.id;

        const findById = museumController.findById(id);
        findById.then((museum) => {
            //delete pic
            if (museum.picture && museum.picture !== cfg.defaultPicMuseum) {
                //check if previous file exists
                const prevPicture = path.join(__dirname, '/..', museum.picture);
                fs.stat(prevPicture, (err, stats) => {
                    if (err) {
                        return console.error(err);
                    }
                    //delete previous file
                    fs.unlink(prevPicture);
                });
            }

            return museumController.removeMuseum(id);
        })
        .then((museum) => {
            return artController.removeMuseumArts(museum.id);
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    });
};
