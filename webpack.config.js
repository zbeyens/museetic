var webpack = require('webpack');
var path = require('path');

// webpack -p
// for HMR without reload, put this at this entry point:
// if (module.hot) {
//     module.hot.accept();
// }

var BUILD_DIR = path.resolve(__dirname, 'client/bundle'); //rename to public
var APP_DIR = path.resolve(__dirname, 'client/js');
var SRC = path.resolve(__dirname, 'client');
var NODE_MODULES = path.resolve(__dirname, "node_modules");

var config = {
    entry: [
        //connect to the server to receive bundle rebuild notifications
        //app
        './client/js/game.js',
    ],

    output: {
        filename: 'bundle.js',
        //path of the bundle, otherwise it's stocked in memory
        path: BUILD_DIR,
        // location of hot update
        publicPath: '/client/bundle',
        //remove the annoying hash
        // hotUpdateChunkFilename: 'hot/hot-update.js',
        // hotUpdateMainFilename: 'hot/hot-update.json'
    },
    postcss: [
        require('autoprefixer')
    ],
    // watch: true,
    // progress: true,
    // target: 'node',

    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    module: {
        //JSX transpiling via babel-loader
        loaders: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader'],
            }, {
                test: [
                    /\.png$/,
                    /\.jpg$/
                ],
                loader: "url-loader"
            }, {
                test: /\.css$/,
                include: [
                    NODE_MODULES,
                    SRC
                ],
                loader: 'style-loader!css-loader!postcss-loader',
            }

        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
    ]
};

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                screw_ie8: true,
                warnings: false
            },
        }),
        // remove duplicate files
        new webpack.optimize.DedupePlugin(),
        // smallest id length for often used ids
        new webpack.optimize.OccurrenceOrderPlugin()
    );
} else {
    config.entry.push('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true');
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    );
}


module.exports = config;
