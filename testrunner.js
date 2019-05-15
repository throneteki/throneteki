var Jasmine = require('jasmine'),
    reporters = require('jasmine-reporters');

var junitReporter = new reporters.JUnitXmlReporter({
    savePath: __dirname + '/testoutput',
    consolidateAll: false
});

var jasmine = new Jasmine();

jasmine.loadConfigFile('jasmine.json');
jasmine.addReporter(junitReporter);
jasmine.execute();
