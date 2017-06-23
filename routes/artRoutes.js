const path = require('path');
const cfg = require('../shared/config');
const fs = require('fs');
const artController = require('../app/controllers/artController'),
userController = require('../app/controllers/userController'),
museumController = require('../app/controllers/museumController'),
async = require('async');

module.exports = (app, isLoggedIn, isModerator, upload) => {
    //NOTE: better error handling...
    const isProduction = process.env.NODE_ENV === 'production';
    if (!isProduction) {
        //populate all the ulb arts if moderator.
        app.get('/populate', isModerator, (req, res) => {
            artController.resetArts();
            res.redirect("/");
        });
    }

    //fetch one art from its id
    app.get('/fetchArt', (req, res) => {
        const artId = decodeURIComponent(req.query.id);

        const findById = artController.findById(artId);
        findById.then((art) => {
            res.send(art);
        }).catch((err) => {
            res.sendStatus(500);
        });
    });

    //if logged in, fetch the arts liked from the user id
    app.get('/fetchmycollection', isLoggedIn, (req, res) => {
        const findByLikes = artController.findByLikes(req.user._id);
        findByLikes.then((arts) => {
            res.send(arts);
        }).catch((err) => {
            res.sendStatus(500);
        });
    });

    //1) fetch all the user arts from the user id
    //2) count the number of arts
    //3) add the current art in arts.skipped
    //4) fetch and send the next art
    const skipArt = (req, res) => {
        async.waterfall([
            //findUserArts from req.user
            (cb) => {
                const findUserArts = userController.findUserArts(req.user);
                findUserArts.then((user) => {
                    cb(null, user.arts);
                }).catch((err) => {
                    cb(err);
                });
            }, //countArts to pick randomly one art
            (userArts, cb) => {
                const countArts = artController.count();
                countArts.then((count) => {
                    cb(null, count, userArts); //
                }).catch((err) => {
                    cb(err);
                });
            }, //findNextArts (random)
            (countArts, userArts, cb) => {
                if (userArts.current) {
                    userArts.skipped.push(userArts.current._id);
                    //once all skipped, empty the skipped list
                    if (userArts.skipped.length >= countArts) {
                        userArts.skipped = [userArts.current._id];
                    }
                }

                const findNextArt = artController.findNextArt(countArts, userArts.current, userArts.skipped);
                findNextArt.then((nextArt) => {
                    cb(null, nextArt, userArts.skipped);
                }).catch((err) => {
                    cb(err);
                });
            }, //updateUserArts from req.user
            (nextArt, skippedArts, cb) => {
                const updateUserArts = userController.updateUserArts(req.user._id, nextArt._id, skippedArts);
                updateUserArts.then((user) => {
                    res.send(nextArt);
                    cb(null, 'done');
                }).catch((err) => {
                    cb(err);
                });
            }
        ], (err, results) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });
    };

    //if logged in, fetch the art.current from the user id. If there is no art.current, skipArt
    app.get('/fetchArtTrend', isLoggedIn, (req, res) => {
        const findUserArts = userController.findUserArts(req.user);
        findUserArts.then((user) => {
            if (!user.arts.current) {
                skipArt(req, res);
            } else {
                res.send(user.arts.current);
            }
        }).catch((err) => {
            res.sendStatus(500);
        });
    });

    //if logged in, skip the current art
    app.get('/skipArt', isLoggedIn, skipArt);

    //if logged in, like/dislike the art
    app.get('/likeart', isLoggedIn, (req, res) => {
        const userId = req.user._id;
        const artId = req.query.id;
        async.waterfall([
            //findUserArts from req.user
            (cb) => {
                const findLike = artController.findLike(userId, artId);
                findLike.then((arts) => {
                    cb(null, arts);
                }).catch((err) => {
                    cb(err);
                });
            },
            (arts, cb) => {
                if (arts.length) {
                    const pullLike = artController.pullLike(userId, artId);
                    pullLike.then((art) => {
                        res.send({
                            undo: true,
                            likes: art.likes
                        });
                        cb(null, 'done');
                    }).catch((err) => {
                        cb(err);
                    });
                } else {
                    const pushLike = artController.pushLike(userId, artId);
                    pushLike.then((art) => {
                        res.send({
                            undo: false,
                            likes: art.likes
                        });
                        cb(null, 'done');
                    }).catch((err) => {
                        cb(err);
                    });
                }
            }
        ], (err, results) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });
    });

    //if logged in, fetch all the comments from the art id.
    app.get('/fetchComments', isLoggedIn, (req, res) => {
        const artId = decodeURIComponent(req.query.id);
        const fetchComments = artController.fetchComments(artId);
        fetchComments.then((art) => {
            res.send(art.comments);
        }).catch((err) => {
            res.sendStatus(500);
        });
    });

    //if logged in, push a comment in an art from its id, content and user id.
    app.post('/sendComment', isLoggedIn, (req, res) => {
        const artId = req.body.artId;
        const content = req.body.content;
        const pushComment = artController.pushComment(req.user._id, artId, content);
        pushComment.then((art) => {
            res.send(art.comments);
        }).catch((err) => {
            res.sendStatus(500);
        });
    });

    //if logged in, delete the comment from the user id, artId and comId
    app.post('/deleteComment', isLoggedIn, (req, res) => {
        const artId = req.body.artId;
        const comId = req.body.comId;

        const pullComment = artController.pullComment(req.user._id, artId, comId);
        pullComment.then((art) => {
            res.send(art.comments);
        }).catch((err) => {
            res.sendStatus(500);
        });
    });

    //if logged in, if moderator, add one art from the form values.
    //if there is a picture, upload it
    //push the art
    //push the art to the corresponding museum
    //send the new art
    app.post('/addArt', isLoggedIn, isModerator, upload.single('picture'), (req, res) => {
        const values = req.body;

        //NOTE: should limit values
        if (req.file) {
            values.picture = '/client/img/uploads/' + req.file.filename;
        } else {
            values.picture = cfg.defaultPicArt;
        }

        let newArt = {};
        const pushArt = artController.pushArt(values);
        pushArt.then((art) => {
            newArt = art;
            return museumController.pushArtToMuseum(art._id, values.museum);
        })
        .then((museum) => {
            res.send(newArt._id);
        })
        .catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    });

    //same than addArt by editing. Edit only the values modified.
    //delete the previous picture if overwritten.
    app.post('/editArt', isLoggedIn, isModerator, upload.single('picture'), (req, res) => {
        const id = req.body.id;
        const msg = req.body;

        const values = {};
        values.title = msg.title ? msg.title : '';
        values.subtitle = msg.subtitle ? msg.subtitle : '';
        values.abstract = msg.abstract ? msg.abstract : '';
        values.desc = msg.desc ? msg.desc : '';

        const findById = artController.findById(id);
        findById.then((art) => {
            //edit only if uploaded file
            if (req.file) {
                if (art.picture && art.picture !== cfg.defaultPicArt) {
                    //check if previous file exists
                    const prevPicture = path.join(__dirname, '/..', art.picture);
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

            const updateArt = artController.updateArt(id, values);
            updateArt.then(() => {
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

    //if logged in/moderator, remove an art from its id
    //delete the picture if existing.
    app.post('/removeArt', isLoggedIn, isModerator, (req, res) => {
        const id = req.body.id;

        const findById = artController.findById(id);
        findById.then((art) => {
            //delete pic
            if (art.picture && art.picture !== cfg.defaultPicArt) {
                //check if previous file exists
                const prevPicture = path.join(__dirname, '/..', art.picture);
                fs.stat(prevPicture, (err, stats) => {
                    if (err) {
                        return console.error(err);
                    }
                    //delete previous file
                    fs.unlink(prevPicture);
                });
            }

            return artController.removeArt(id);
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
