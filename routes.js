var populate = require('./app/controllers/populate');

module.exports = function(app, passport) {
    var isProduction = process.env.NODE_ENV === 'production';

    if (!isProduction) {
        app.get('/populate', (req, res) => {
            populate();
            res.redirect("/");
        });
    }

    //Facebook
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email'],
        authType: 'rerequest',
        display: 'popup',
    }));
    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        // successRedirectSocial: '/auth/facebook/success',
        failureRedirect: '/',
    }), successRedirectSocial, isLoggedIn);

    app.get('/loadAuth', function(req, res, next) {
        console.log("load:");
        if (req.isAuthenticated()) {
            var userInfo = {};
            return res.send(getUserInfo(req.user));
        } else {
            return res.send(false);
        }
    });

    //headers: cookie: 'PHPSESSID=k1rhunhmmp0kdoiaha3gjc4gi0; connect.sid=s%3AVYdD_qIvhfNsLxYdWcdL1z4VFSmG4iNR.MgLRp27o7YsxQwNq3a%2BW98r96gLvFdmmbDfDL0IPT1M' }
    //sessionID: 'VYdD_qIvhfNsLxYdWcdL1z4VFSmG4iNR',

    //Local
    app.post('/signup', isLoggedOut, function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
            console.log(info);
            console.log(req.session);
            if (err) return res.sendStatus(500);

            //invalid logs
            if (!user) {
                return res.status(400).send(info);
            }
            //req.user is put.
            req.login(user, function(err) {
                if (err) return res.sendStatus(500);
                return res.send(getUserInfo(user));
                // return next();
            });
        })(req, res, next);
    });

    //req.login automatically invoked with passport.authenticate.
    app.post('/login', isLoggedOut, function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) return res.sendStatus(500);

            //invalid logs
            if (!user) {
                return res.status(400).send(info);
            }
            console.log("login!");
            //req.user is put.
            req.login(user, function(err) {
                if (err) return res.sendStatus(500);
                return res.send(getUserInfo(user));
                // return next();
            });
        })(req, res, next);
    });

    app.post('/logout', isLoggedIn, function(req, res) {
        console.log('Disconnected');
        req.logout(); //req.user=null.
        req.session.destroy();
        res.sendStatus(200);
    });

    app.get('/arttrend', isLoggedIn, function(req, res) {
        console.log("sending artTrend");

        var artTrendInfo = getArtTrendInfo();
        res.send(artTrendInfo);
    })

    //Main - after all our routing
    app.get('*', function(req, res) {
        res.sendFile(__dirname + '/index.html');
    });
};


function isLoggedOut(req, res, next) {
    // if user is authenticated (req.user) in the session, carry on
    if (req.isAuthenticated()) {
        return res.sendStatus(403);
    }

    return next();
}

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (!req.isAuthenticated()) {
        return res.sendStatus(403);
    }

    return next();
}

function getUserInfo(user) {
    var userInfo = {};
    userInfo.email = user.local.email;
    userInfo.name = user.local.name;
    return userInfo;
}

function getArtTrendInfo() {
    var artInfo = {};
    artInfo.picture = '/client/img/uploads/pic1.jpg';
    artInfo.title = "Le bureau de Jules Bordet - Musée de la Médecine";
    artInfo.desc = `Ce bureau en bois a appartenu à Jules Bordet (1870-1961) et a été légué au Musée de la Médecine par son petit-fils, André Govaerts, professeur d’immunologie à l’Université libre de Bruxelles.

Docteur en médecine à l’ULB en 1892, Jules Bordet débute ses travaux de recherche à Paris, dans le laboratoire d’élie Metchnikoff à l’Institut Pasteur. Huit ans plus tard, il quitte la capitale française pour fonder le même Institut dans le Brabant, qu'il dirige de 1901 à 1940. Bordet y fait des recherches en immunologie et démontre que deux substances entrent en compte dans la bactériolyse (destruction des bactéries). La première est une substance chimique agissant spécifiquement contre la bactérie, développée par le corps comme réaction de l’immunisation ; la seconde est une substance thermolabile, contenue dans tous les sérums, qu’il appelle « alexine » (du grec alexein, repousser). Aujourd’hui, ces deux substances sont connues respectivement sous le nom d’« anticorps » et de « complément ».

En 1894, Pfeiffer démontre que les propriétés bactériolytiques du sérum immunisé servent au diagnostic du choléra en laboratoire. Reprenant son concept et le modifiant, Bordet prouve que le test peut être fait dans une éprouvette. À l’aide de ces données, il développe, avec son confrère Octave Gengou, le test de fixation du complément, qui permet de dépister premièrement la syphilis (réaction Bordet-Wassermann), puis plusieurs autres maladies contagieuses. En 1906, Bordet et Gengou découvrent également le coccobacille de la coqueluche (Bordetella pertussis).

Les nombreux travaux que Jules Bordet consacre à la bactériologie et à l’immunologie sont couronnés en 1919 par le Prix Nobel de physiologie ou médecine. Jules Bordet est ainsi le premier scientifique belge à être récompensé par ce prix prestigieux. En 1924, il intègre la direction scientifique du Centre des Tumeurs de l’hôpital Brugmann à Bruxelles et, en 1935, un nouvel institut porte son nom. Enfin, en 1933, il est appelé à présider le Conseil scientifique de l’Institut Pasteur de Paris. Le Musée de la Médecine est aujourd’hui fier d’exposer le bureau de Jules Bordet, éminent professeur de l’ULB, premier prix Nobel belge de Médecine et scientifique du plus haut niveau, dont le travail fut déterminant pour le diagnostic et le traitement de plusieurs maladies contagieuses dangereuses.

Bureau de Jules Bordet Bois, 177 x 86 cm, XIXe s. – Inv. MM-1996-028`;
    return artInfo;
}

function successRedirectSocial(req, res) {
    res.send('<html><head><script type="text/javascript">window.close();</script></head></html>');
}
