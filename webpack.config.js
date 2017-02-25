var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// webpack -p
// for HMR without reload, put this at this entry point:
// if (module.hot) {
//     module.hot.accept();
// }

var BUILD_DIR = path.resolve(__dirname, 'client/bundle'); //rename to public
var APP_DIR = path.resolve(__dirname, 'client/js');
var SRC = path.resolve(__dirname, 'client');
var NODE_MODULES = path.resolve(__dirname, "node_modules");
var env = process.env.NODE_ENV;
var isProd = process.env.NODE_ENV === "production";

var config = {
    entry: [
        //connect to the server to receive bundle rebuild notifications
        'babel-polyfill',
        'react-hot-loader/patch',
        './client/js/index',
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
        }, {
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg|otf)$/,
            loader: 'url-loader?limit=50000&name=[name]-[hash].[ext]'
        }]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(env)
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: isProd,
            debug: !isProd,
            options: {
                context: SRC,
                postcss: [ // <---- postcss configs go here under LoadOptionsPlugin({ options: { ??? } })
                    // require('postcss-cssnext'),
                    // require('lost')(),
                    // require(postcss-import': {},
                    // 'postcss-cssnext': {
                    //     browsers: ['last 2 versions', '> 5%'],
                    // },
                    require('autoprefixer')({
                        browsers: [
                            'last 3 version', //last 2 by default
                            'ie >= 10',
                        ],
                    }),
                    require('postcss-reporter')()
                ]
            }
        }),

    ]
};

if (isProd) {
    config.module.rules.push({
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            loader: 'css-loader?minimize&modules&importLoaders=1!postcss-loader',
        }),
    }, {
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            loader: 'css-loader?minimize&modules&importLoaders=1!postcss-loader!sass-loader'
        })
    });
    config.plugins.push(
        new ExtractTextPlugin({
            allChunks: true,
            filename: 'styles.css'
        }),
        new OptimizeCssAssetsPlugin({ //not sure
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        }),
        new webpack.optimize.UglifyJsPlugin({
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
        // remove duplicate files, NOT NEEDED ANYMORE W2
        // new webpack.optimize.DedupePlugin(),
        // smallest id length for often used ids, DEFAULT
        // new webpack.optimize.OccurrenceOrderPlugin()
    );
} else {
    config.entry.push('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true');
    config.module.rules.push({
        test: /\.css$/,
        include: [
            NODE_MODULES,
            SRC
        ],
        use: [
            "style-loader",
            "css-loader?modules&importLoaders=1&sourceMap",
            "postcss-loader"
        ]
    }, {
        test: /\.(sass|scss)$/,
        use: [
            "style-loader",
            "css-loader?modules&importLoaders=1&sourceMap",
            "postcss-loader",
            "sass-loader"
        ]
    });
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
}


module.exports = config;
