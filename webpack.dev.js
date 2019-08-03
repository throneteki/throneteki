const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    entry: {
        'bundle': ['react-hot-loader/patch', './index.jsx', 'webpack-hot-middleware/client']
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
        proxy: [{
            context: ['/**', '!/img/**', '!/fonts/**', '!/sound/**'],
            target: `http://${process.env.HOST || 'localhost'}:4000`
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});
