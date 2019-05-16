/*eslint no-console:0 */
const octo = require('@octopusdeploy/octopackjs');
const version = require('./packagever');

octo.pack('targz', { id: 'throneteki-node', version: version })
    .append('./version.js')
    .append('./index.js')
    .append('./package.json')
    .append('./server/**/*.js')
    .append('./throneteki-json-data/**/*')
    .toFile('./dist', function(err, data) {
        console.log('Package Saved: ' + data.name);
    });
