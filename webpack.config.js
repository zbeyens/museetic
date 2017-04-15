const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'client/bundle'); //rename to public
// const APP_DIR = path.resolve(__dirname, 'client/js');
// const SRC = path.resolve(__dirname, 'client');
// const NODE_MODULES = path.resolve(__dirname, "node_modules");
const env = process.env.NODE_ENV;
const isProd = process.env.NODE_ENV === "production";
// const isDevServer = process.env.NODE_ENV === "devserver";

const config = {
    entry: [
        //connect to the server to receive bundle rebuild notifications
        './client/js/game.js',
    ],
    
    output: {
        filename: 'bundle.js',
        //path of the bundle, otherwise it's stocked in memory
        path: BUILD_DIR,
        // location of hot update
        publicPath: '/client/bundle',
    },
    
    resolve: {
        extensions: ['.js', '.jsx']
    },
    
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: ['babel-loader'],
        }]
        //JSX transpiling via babel-loader
        // test: [
        //     /\.png$/,
        //     /\.jpg$/
        // ],
        // loader: "url-loader"
    },
    
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(env)
            }
        })
    ]
};

if (isProd) {
    config.devtool = "source-map";
    config.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false, //true for minimized code or want correct line numbers for uglifyjs warnings
            compress: {
                warnings: false, //true to debug
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
            },
            output: {
                comments: false,
            },
        })
    );
} else {
    config.entry.push('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true');
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin()
        // new webpack.NoErrorsPlugin()
    );
}

module.exports = config;
