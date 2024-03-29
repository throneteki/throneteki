const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    entry: {
        'bundle': ['react-hot-loader/patch', './index.jsx']
    },
    output: {
        filename: '[name].[hash].js'
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './assets',
        hot: true,
        host: process.env.HOST || 'localhost',
        historyApiFallback: true,
        proxy: [{
            context: ['/api', '/socket.io'],
            target: `http://${process.env.LOBBYHOST || 'localhost'}:4000`
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});
