exports = module.exports = (mongoose) => {
    //dev - production
    const url = process.env.MONGODB_URI || 'mongodb://localhost/museetic';

    // Makes connection asynchronously.  Mongoose will queue up database operations
    // and release them when the connection is complete.
    mongoose.Promise = global.Promise;
    mongoose.connect(url, {
        server: {
            socketOptions: {
                keepAlive: 300000,
                connectTimeoutMS: 30000
            }
        },
        replset: {
            socketOptions: {
                keepAlive: 300000,

                connectTimeoutMS: 30000
            }
        }
    });
    mongoose.set('debug', true);
};
