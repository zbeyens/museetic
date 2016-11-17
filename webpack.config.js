var webpack = require('webpack');
var path = require('path');

//webpack
//webpack-dev-server (port 8080)
//webpack-dev-server --hot --inline --history-api-fallback

var BUILD_DIR = path.resolve(__dirname, 'client/dist');
var APP_DIR = path.resolve(__dirname, 'client/js');

var config = {
    // devtool: 'cheap-module-source-map',
    entry: [
        // 'webpack-dev-server/client?http://localhost:8080',
        // 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
        './client/js/index.jsx',
    ],
    // target: 'node',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    watch: true,
    progress: true,

    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: ['babel-loader'],
        }]
    },

    // devServer: {
    //     hot: true,
    //     contentBase: './' //same dir than index.html
    // },
    plugins: [
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'NODE_ENV': JSON.stringify('production')
        //     }
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
        // new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.OccurrenceOrderPlugin(),
    ]

};

module.exports = config;
