const artController = require('../app/controllers/artController'),
userController = require('../app/controllers/userController'),
async = require('async');

module.exports = (app, isLoggedIn) => {
    // const isProduction = process.env.NODE_ENV === 'production';

    //NOTE: better error handling...
    // if (!isProduction) {
    app.get('/populate', (req, res) => {
        artController.resetArts();
        res.redirect("/");
    });
    // }

    app.get('/fetchArt', (req, res) => {
        const artId = decodeURIComponent(req.query.id);

        const findById = artController.findById(artId);
        findById.then((art) => {
            res.send(art);
        }).catch((err) => {
            res.sendStatus(500);
        });
    });

    app.get('/fetchmycollection', isLoggedIn, (req, res) => {
        const findByLikes = artController.findByLikes(req.user._id);
        findByLikes.then((arts) => {
            res.send(arts);
        }).catch((err) => {
            res.sendStatus(500);
        });
    });

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
                console.log(userArts);
                const countArts = artController.count();
                countArts.then((count) => {
                    cb(null, count, userArts); //
                }).catch((err) => {
                    cb(err);
                });
            }, //findNextArts (random)
            (countArts, userArts, cb) => {
                userArts.skipped.push(userArts.current._id);

                //once all skipped, empty the skipped list
                if (userArts.skipped.length >= countArts) {
                    userArts.skipped = [userArts.current._id];
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
        console.log("sending currentArt");
    };

    app.get('/fetchArtTrend', isLoggedIn, (req, res) => {
        const findUserArts = userController.findUserArts(req.user);
        findUserArts.then((user) => {
            if (!user.arts.current) {
                console.log(user);
                skipArt(req, res);
            } else {
                res.send(user.arts.current);
            }
        }).catch((err) => {
            res.sendStatus(500);
        });
    });

    app.get('/skipArt', isLoggedIn, skipArt);

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
                console.log(arts);
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

    app.get('/fetchComments', isLoggedIn, (req, res) => {
        const artId = decodeURIComponent(req.query.id);
        const fetchComments = artController.fetchComments(artId);
        fetchComments.then((art) => {
            res.send(art.comments);
        }).catch((err) => {
            res.sendStatus(500);
        });
    });

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
};
