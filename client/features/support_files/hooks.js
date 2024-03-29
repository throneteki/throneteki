/* eslint-disable no-console */

const { After, Before } = require('cucumber');
const { Builder } = require('selenium-webdriver');
const browserstack = require('browserstack-local');

const configFile = '../conf/' + (process.env.CONFIG_FILE || 'browserstack') + '.conf.js';
const config = require(configFile).config;

const username = process.env.BROWSERSTACK_USERNAME || config.user;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY || config.key;

const createBrowserStackSession = function(config, caps) {
    return new Builder()
        .usingServer('http://' + config.server + '/wd/hub')
        .withCapabilities(caps)
        .build();
};

let bsLocal = null;

Before(function(scenario, callback) {
    let world = this;
    let taskId = parseInt(process.env.TASK_ID || 0);
    let caps = config.capabilities[taskId];

    caps['browserstack.user'] = username;
    caps['browserstack.key'] = accessKey;

    world.testHost = config.testHost;

    if(caps['browserstack.local']) {
        // Code to start browserstack local before start of test and stop browserstack local after end of test
        bsLocal = new browserstack.Local();
        bsLocal.start({ 'key': accessKey }, function(error) {
            if(error) {
                console.error(error);
            }

            world.driver = createBrowserStackSession(config, caps);
            callback();
        });
    } else {
        world.driver = createBrowserStackSession(config, caps);
        callback();
    }
});

After(function(scenario, callback) {
    this.driver.quit().then(function() {
        if(bsLocal) {
            bsLocal.stop(callback);
        } else {
            callback();
        }
    });
});
