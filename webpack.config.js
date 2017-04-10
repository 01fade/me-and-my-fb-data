var debug = process.env.NODE_ENV !== "prod";
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var copyPatterns = [
    { from: "./css", to: "../css" },
    { from: "./index.html", to: "../index.html" },
    { from: "./map.html", to: "../map.html" }
];

module.exports = {
    context: __dirname + "/src",
    devtool: debug ? "inline-sourcemap" : null,
    entry: {
        index: "./js/index.js",
        map: "./js/map.js"
    },
    output: {
        path: __dirname + "/build/js",
        filename: "[name].js"
    },
    module: {
        loaders: [{
            test: /\.scss$/,
            loaders: ["style-loader", "css-loader", "sass-loader"]
        }]
    },
    plugins: debug ? [
        new CleanWebpackPlugin(['build']),
        new webpack.ProvidePlugin({ '$': 'jquery' }),
        new CopyWebpackPlugin(copyPatterns)
    ] : [
        new CleanWebpackPlugin(['build']),
        new webpack.ProvidePlugin({ '$': 'jquery' }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false, compress: false }),
        new CopyWebpackPlugin(copyPatterns),
    ],
};
