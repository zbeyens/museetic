const path = require('path');
const cfg = require('../shared/config');
const fs = require('fs');
const userController = require('../app/controllers/userController'),
artController = require('../app/controllers/artController'),
validator = require('validator'),
async = require('async');

module.exports = (app, isLoggedIn, isModerator, upload) => {
    //send a list of suggestions in search bar
    //if length is valide
    app.get('/suggestions', isLoggedIn, (req, res) => {
        let q = req.query.q;
        if (!q)
        return;

        q = decodeURIComponent(q);
        const valideLength = validator.isLength(q, {
            min: 1,
            max: 30
        });
        if (!valideLength) {
            res.sendStatus(400);
            return;
        }
        q = validator.trim(q);

        const searchUsers = userController.searchUsersByName(q);
        searchUsers.then((users) => {
            res.send(users);
        }).catch((err) => {
            res.sendStatus(400);
            console.log(err);
        });
    });

    //fetch one user profile
    app.get('/search', isLoggedIn, (req, res) => {
        const q = req.query.q;
        const id = decodeURIComponent(q);

        async.waterfall([
            //findArtCurrent from req.user
            (cb) => {
                const findUserById = userController.findUserById(id);
                findUserById.then((user) => {
                    cb(null, user);
                }).catch((err) => {
                    cb(err);
                });
            },
            (user, cb) => {
                const findByLikes = artController.findByLikes(user._id);
                findByLikes.then((arts) => {
                    res.send({
                        user, //send all friends, friendRequests (no time...)
                        arts
                    });
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
    });

    //push/pull friend request
    //can not be friend with self.
    app.get('/addFriend', isLoggedIn, (req, res) => {
        let q = req.query.q;
        if (!q)
        return;

        q = decodeURIComponent(q);

        const findUserById = userController.findUserById(q);
        findUserById.then((userProfile) => {
            if (userProfile._id.equals(req.user._id)) {
                throw new Error("can not be friend with self");
            }

            let friendRequested = 0;
            for (let i = 0; i < userProfile.friendRequests.length; i++) {
                if (userProfile.friendRequests[i].equals(req.user._id)) {
                    friendRequested = 1;
                    break;
                }
            }
            if (!friendRequested) {
                const pushFriendRequest = userController.pushFriendRequest(q, req.user._id);
                pushFriendRequest.then(() => {
                    res.sendStatus(200);
                }).catch((err) => {
                    res.sendStatus(500);
                    console.log(err);
                });
            } else {
                const pullFriendRequest = userController.pullFriendRequest(q, req.user._id);
                pullFriendRequest.then(() => {
                    res.sendStatus(200);
                }).catch((err) => {
                    res.sendStatus(500);
                    console.log(err);
                });
            }
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
        //should check if not in friendRequests first...
    });

    //remove from the friend list for both users
    app.get('/removeFriend', isLoggedIn, (req, res) => {
        const q = req.query.q;

        const removeFriend = userController.removeFriend(req.user.id, q);
        removeFriend.then((user) => {
            const removedFriend = userController.removeFriend(q, req.user.id);
            removedFriend.then(() => {
                res.sendStatus(200);
            }).catch((err) => {
                res.sendStatus(500);
                console.log(err);
            });
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
        //should check if not in friendRequests first...
    });


    //if admin, add in moderator
    app.get('/addModerator', isLoggedIn, (req, res) => {
        const q = req.query.q;

        if (req.user.role === 'admin') {
            const removeModerator = userController.addModerator(q);
            removeModerator.then((user) => {
                res.sendStatus(200);
            }).catch((err) => {
                res.sendStatus(500);
                console.log(err);
            });
        } else {
            res.sendStatus(401);
        }
    });

    //if admin, remove from moderator
    app.get('/removeModerator', isLoggedIn, (req, res) => {
        const q = req.query.q;

        if (req.user.role === 'admin') {
            const removeModerator = userController.removeModerator(q);
            removeModerator.then((user) => {
                res.sendStatus(200);
            }).catch((err) => {
                res.sendStatus(500);
                console.log(err);
            });
        } else {
            res.sendStatus(401);
        }
    });

    //fetch the friend requests from the user id
    app.get('/fetchNotifications', isLoggedIn, (req, res) => {
        const fetchNotifications = userController.fetchNotifications(req.user.id);
        fetchNotifications.then((user) => {
            res.send(user.friendRequests);
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
        //should check if not in friendRequests first...
    });

    //fetch the friends from the user id
    app.get('/fetchFriends', isLoggedIn, (req, res) => {
        const fetchFriends = userController.fetchFriends(req.user.id);
        fetchFriends.then((user) => {
            res.send(user.friends);
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    });

    //accept friend -> push in friend list of both users.
    //NOTE: check if not in friend...
    app.get('/acceptFriend', isLoggedIn, (req, res) => {
        const q = req.query.q;

        const acceptFriend = userController.acceptFriend(req.user.id, q);
        acceptFriend.then((user) => {
            const acceptedFriend = userController.acceptFriend(q, req.user.id);
            acceptedFriend.then(() => {
                res.sendStatus(200);
            }).catch((err) => {
                res.sendStatus(500);
                console.log(err);
            });
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
        //should check if not in friendRequests first...
    });

    //decline a friend request from 2 user id
    app.get('/declineFriend', isLoggedIn, (req, res) => {
        const q = req.query.q;

        const declineFriend = userController.declineFriend(req.user.id, q);
        declineFriend.then((user) => {
            res.sendStatus(200);
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
        //should check if not in friendRequests first...
    });

    //edit a user profile.
    //Edit only the values modified.
    //delete the previous picture if overwritten.
    app.post('/editUser', isLoggedIn, upload.single('picture'), (req, res) => {
        const msg = req.body;

        const values = {};
        if (msg.name) {
            values.name = msg.name;
        }
        values.profession = msg.profession ? msg.profession : '';
        values.gender = msg.gender ? msg.gender : '';
        values.bio = msg.bio ? msg.bio : '';
        values.location = msg.location ? msg.location : '';


        const findUserById = userController.findUserById(req.user.id);
        findUserById.then((user) => {
            //edit only if uploaded file
            if (req.file) {
                if (user.picture && user.picture !== cfg.defaultPicUser) {
                    //check if previous file exists
                    const prevPicture = path.join(__dirname, '/..', user.picture);
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

            return userController.updateUser(req.user.id, values);
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
