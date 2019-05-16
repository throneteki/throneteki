/*eslint no-console:0 */
const octo = require('@octopusdeploy/octopackjs');
const assets = require('./vendor-assets.json');

function OctoWebpackPlugin(options) {
    this.options = options || {};
}

OctoWebpackPlugin.prototype.apply = function(compiler) {
    let options = this.options;

    let pkg;

    compiler.plugin('after-emit', function(compilation, callback) {
        let files = compilation.assets;
        pkg = octo.pack(options.type, { id: options.id, version: options.version });

        for(var name in compilation.assets) {
            pkg.append(name, compilation.assets[name].existsAt);
        }

        pkg.append('vendor-assets.json', './vendor-assets.json');
        pkg.append(assets.vendor.js.slice(1), './dist' + assets.vendor.js);

        callback();
    });

    compiler.plugin('done', function(foo) {
        pkg.append('assets.json', './assets.json');

        pkg.toFile('./out', function(error, data) {
            if(error) {
                console.error(error);
            } else {
                console.log('Packed ' + data.name);
            }
        });
    });
};

module.exports = OctoWebpackPlugin;
