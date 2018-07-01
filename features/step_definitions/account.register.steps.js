const { Given, When, Then } = require('cucumber');
const { assert } = require('chai');
const faker = require('faker');
const monk = require('monk');
const configFile = '../conf/' + (process.env.CONFIG_FILE || 'remote') + '.conf.js';
const config = require(configFile).config;

const db = monk(config.dbPath);

const request = require('./request');

Given('I setup an API request', async function () {
    this.requestBody = {};
});

When('I submit the API request to the {string} endpoint', async function (endpoint) {
    this.result = await request.postToEndpoint(endpoint, this.requestBody);
});

When('I set the {string} to {string}', function (field, value) {
    this.requestBody[field] = value;
});

When('I set valid account details', function () {
    this.requestBody.username = faker.internet.userName().replace('.', '-');
    this.requestBody.email = faker.internet.email();
    this.requestBody.password = faker.internet.password();
});

Then('I should get a {string} failure response', function (message) {
    assert.isFalse(this.result.success, 'the API call should not succeed');
    assert.equal(this.result.message, message);
});

Then('I should get a success message and an account is registered', async function () {
    assert.isTrue(this.result.success, 'the API call should succeed');

    let users = db.get('users');

    console.info(this.requestBody.username);

    let user = await users.find({ username: this.requestBody.username });

    console.info(user);

    db.close();
});
