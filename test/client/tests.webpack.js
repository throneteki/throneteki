require('babel-polyfill');
var context = require.context('./', true, /\.jsx$/);
context.keys().forEach(context);
