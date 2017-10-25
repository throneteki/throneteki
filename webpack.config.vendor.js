const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const BUILD_DIR = path.resolve(__dirname, 'public');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    const sharedConfig = {
        stats: { modules: false },
        resolve: { extensions: ['.js'] },
        module: {
            rules: [
                { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' }
            ]
        },
        entry: {
            vendor: [
                'bootstrap',
                'babel-polyfill',
                'event-source-polyfill',
                'react',
                'react-dom',
                'react-redux',
                'redux',
                'redux-thunk',
                'jquery',
                'moment',
                'prop-types',
                'query-string',
                'react-bootstrap-typeahead'
            ]
        },
        output: {
            publicPath: 'dist/',
            filename: '[name].js',
            library: '[name]_[hash]'
        },
        plugins: [
            new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }),
            new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, require.resolve('node-noop')), // Workaround for https://github.com/andris9/encoding/issues/16
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
            })
        ]
    };

    const clientBundleConfig = merge(sharedConfig, {
        output: { path: BUILD_DIR },
        module: {
            rules: [
            ]
        },
        plugins: [
            new webpack.DllPlugin({
                path: path.join(BUILD_DIR, '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ].concat(isDevBuild ? [] : [
            new webpack.optimize.UglifyJsPlugin()
        ])
    });

    return clientBundleConfig;
};
