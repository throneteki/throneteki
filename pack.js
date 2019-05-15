/*eslint no-console:0 */
const octo = require('@octopusdeploy/octopackjs');
const version = require('./packagever');

octo.pack('targz', { version: version })
    .append('./version.js')
    .append('./index.js')
    .append('./package.json')
    .append('./server/**/*.js')
    .append('./public/**/*')
    .append('./node_modules/**/*')
    .append('./throneteki-json-data/**/*')
    .append('./views/**/*.pug')
    .toFile('./dist', function(err, data) {
        console.log('Package Saved: ' + data.name);
    });
