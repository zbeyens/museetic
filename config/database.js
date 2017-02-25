exports = module.exports = (mongoose) => {
    //dev - production
    const isProduction = process.env.NODE_ENV === 'production';
    let url;
    if (isProduction) {
        url = 'mongodb://ds157839.mlab.com:57839/heroku_l6px1vd0';
    } else {
        url = 'mongodb://localhost/museetic';
    }

    // Makes connection asynchronously.  Mongoose will queue up database
    // operations and release them when the connection is complete.
    mongoose.Promise = global.Promise;
    mongoose.connect(url, {
        server: {
            socketOptions: {
                keepAlive: 300000,
                connectTimeoutMS: 30000,
            }
        },
        replset: {
            socketOptions: {
                keepAlive: 300000,

                connectTimeoutMS: 30000,
            }
        }
    });
    mongoose.set('debug', true);
};
