/*eslint no-console:0 */
const octo = require('@octopusdeploy/octopackjs');

function OctoWebpackPlugin(options) {
    this.options = options || {};
}

OctoWebpackPlugin.prototype.apply = function(compiler) {
    let options = this.options;
    let pkg;

    compiler.plugin('after-emit', function(compilation, callback) {
        pkg = octo.pack(options.type, { id: options.id, version: options.version });

        for(var name in compilation.assets) {
            pkg.append(name, compilation.assets[name].existsAt);
        }

        pkg.appendSubDir('./assets', true);

        callback();
    });

    compiler.plugin('done', function() {
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
