// Use DefinePlugin (Webpack)
// together with Uglify to strip the dev branch in prod build.
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./configureStore.prod');
} else {
    module.exports = require('./configureStore.dev');
}
