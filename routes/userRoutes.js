// const async = require('async');
const userController = require('../app/controllers/userController'),
artController = require('../app/controllers/artController'),
validator = require('validator'),
async = require('async');

module.exports = (app, isLoggedIn) => {
    //send [] suggestions
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

    //send 1 user
    app.get('/search', isLoggedIn, (req, res) => {
        const q = req.query.q;
        const id = decodeURIComponent(q);
        console.log(q);

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
                console.log(user);
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
            console.log(friendRequested);
            if (!friendRequested) {
                const pushFriendRequest = userController.pushFriendRequest(q, req.user._id);
                pushFriendRequest.then(() => {
                    console.log("added");
                    res.sendStatus(200);
                }).catch((err) => {
                    res.sendStatus(500);
                    console.log(err);
                });
            } else {
                const pullFriendRequest = userController.pullFriendRequest(q, req.user._id);
                pullFriendRequest.then(() => {
                    console.log("removed");
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
    app.get('/fetchFriends', isLoggedIn, (req, res) => {
        const fetchFriends = userController.fetchFriends(req.user.id);
        fetchFriends.then((user) => {
            res.send(user.friends);
        }).catch((err) => {
            res.sendStatus(500);
            console.log(err);
        });
    });

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
};
