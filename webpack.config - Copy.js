var webpack = require('webpack');
var path = require('path');

//webpack
//webpack-dev-server (port 8080)
//webpack-dev-server --hot --inline --history-api-fallback

var BUILD_DIR = path.resolve(__dirname, 'client/bundle'); //rename to public
var APP_DIR = path.resolve(__dirname, 'client/js');
var SRC = path.resolve(__dirname, 'client');
var NODE_MODULES = path.resolve(__dirname, "node_modules");

var config = {
    // devtool: 'cheap-module-source-map',
    entry: [
        // //for refreshing the browser
        // 'webpack-dev-server/client?http://localhost:8081',
        // //for hot updates
        // 'webpack/hot/only-dev-server',
        //app
        './client/js/game.js',
    ],

    output: {
        //path of the bundle, otherwise it's stocked in memory
        path: BUILD_DIR,
        filename: 'bundle.js',
        //location of hot update
        publicPath: '/client/bundle',
        //remove the annoying hash
        hotUpdateChunkFilename: 'hot/hot-update.js',
        hotUpdateMainFilename: 'hot/hot-update.json'
    },
    postcss: [
        require('autoprefixer')
    ],
    watch: true,
    progress: true,
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
            },
            // {
            //     test: [
            //         /\.png$/,
            //         /\.jpg$/
            //     ],
            //     loader: "url-loader"
            // }, {
            //     test: /\.css$/,
            //     include: [
            //         NODE_MODULES,
            //         SRC
            //     ],
            //     loader: 'style-loader!css-loader!postcss-loader',
            // }

        ]
    },

    plugins: [
        //PROD: uglify
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
                screw_ie8: true
            },
            // // warnings about unused variable
            // compress: {
            //     warnings: false
            // }
        }),
        // remove duplicate files
        new webpack.optimize.DedupePlugin(),
        // smallest id length for often used ids
        new webpack.optimize.OccurrenceOrderPlugin()
    );
    babelSettings.plugins.push("transform-react-inline-elements");
    babelSettings.plugins.push("transform-react-constant-elements");
} else {
    // config.devtool = "#cheap-module-source-map";
    // config.devServer = {
    //     contentBase: './client', //same dir than index.html
    //     hot: true,
    //     inline: true, //
    //     host: "localhost",
    //     port: 8081
    // };
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    );
}


module.exports = config;
