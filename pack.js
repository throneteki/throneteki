/*eslint no-console:0 */
const octo = require('@octopusdeploy/octopackjs');

octo.pack()
    .append('./version.js')
    .append('./index.js')
    .append('./package.json')
    .append('./server/**/*.js')
    .append('./public/**/*')
    .append('./throneteki-json-data/**/*')
    .append('./views/**/*.pug')
    .toFile('./dist', function (err, data) {
        console.log('Package Saved: ' + data.name);
    });
