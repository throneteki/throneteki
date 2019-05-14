var Jasmine = require('jasmine'),
    reporters = require('jasmine-reporters');

var junitReporter = new reporters.JUnitXmlReporter({
  savePath: __dirname + '/testoutput',
  consolidateAll: false
});

var jasmine = new Jasmine();

jasmine.loadConfig({
  "spec_dir": "test",
  "spec_files": [
    "**/*[sS]pec.js"
  ],
  "helpers": [
    "helpers/**/*.js"
  ],
  "stopSpecOnExpectationFailure": false,
  "random": false
});
//jasmine.loadConfigFile("jasmine.json");
jasmine.addReporter(junitReporter);
jasmine.execute();
