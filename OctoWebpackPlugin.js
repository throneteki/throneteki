/*eslint no-console:0 */
const octo = require('@octopusdeploy/octopackjs');

function OctoWebpackPlugin(options) {
    this.options = options || {};
}

OctoWebpackPlugin.prototype.apply = function(compiler) {
    let options = this.options;

    compiler.plugin('after-emit', function(compilation, callback) {
        let files = compilation.assets;
        let pkg = octo.pack(options.type, { id: options.id, version: options.version });

        for(var name in compilation.assets) {
            pkg.append(name, compilation.assets[name].existsAt);
        }

        pkg.toFile('./out', function(error, data) {
            if(error) {
                compilation.errors.push(new Error(error));
                callback();
            } else {
                console.log('Packed \'' + data.name + '\' with ' + Object.keys(files).length + ' files');
            }
        });
    });
};

module.exports = OctoWebpackPlugin;
