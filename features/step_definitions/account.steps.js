const { Given, When, Then } = require('cucumber');
const { assert } = require('chai');
const faker = require('faker');
const monk = require('monk');
const configFile = '../conf/' + (process.env.CONFIG_FILE || 'remote') + '.conf.js';
const config = require(configFile).config;
const moment = require('moment');

const db = monk(config.dbPath);
const dbUsers = db.get('users');

const request = require('./request');

function setValidDetails(requestBody) {
    requestBody.username = faker.internet.userName().replace('.', '-').substring(0, 15);
    requestBody.email = faker.internet.email();
    requestBody.password = faker.internet.password();
}

async function fetchUser(username) {
    let users = await dbUsers.find({ username: username });

    if(users.length === 0) {
        return undefined;
    }

    let user = users[0];

    return user;
}

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
    setValidDetails(this.requestBody);
});

When('I set the id to an existing user not expecting validation', async function () {
    setValidDetails(this.requestBody);

    let result = await request.postToEndpoint('/account/register', this.requestBody);
    assert.isTrue(result.success);

    let user = await fetchUser(this.requestBody.username);
    assert.isNotNull(user);

    await dbUsers.update({ username: this.requestBody.username }, { '$set': { activiationToken: undefined } });

    this.requestBody = { token: this.requestBody.token, id: user._id };
    this.currentUser = user;
});

When('I set the id to an existing user', async function () {
    setValidDetails(this.requestBody);

    let result = await request.postToEndpoint('/account/register', this.requestBody);
    assert.isTrue(result.success);

    let user = await fetchUser(this.requestBody.username);
    assert.isNotNull(user);

    this.requestBody = { token: this.requestBody.token, id: user._id };
    this.currentUser = user;
});

When('I set the token to expired', async function () {
    await dbUsers.update({ username: this.currentUser.username }, { '$set': { activiationTokenExpiry: moment(new Date()).add(-1, 'day') } });

    this.requestBody.token = this.currentUser.activiationToken;
});

When('I set the token to the correct token', async function () {
    this.requestBody.token = this.currentUser.activiationToken;
});

Then('I should get a {string} failure response', function (message) {
    assert.isFalse(this.result.success, 'the API call should not succeed');
    assert.equal(this.result.message, message);
});

Then('I should get a success message and an account is registered', async function () {
    assert.isTrue(this.result.success, 'the API call should succeed');

    let user = await fetchUser(this.requestBody.username);

    assert.isNotNull(user);
    assert.equal(user.username, this.requestBody.username);
    assert.equal(user.email, this.requestBody.email);
    assert.isFalse(user.verified);

    db.close();
});

Then('The user should be activated', async function () {
    assert.isTrue(this.result.success, 'the API call should succeed');

    let user = await fetchUser(this.currentUser.username);

    console.info(user);

    assert.isNotNull(user);
    assert.isUndefined(user.activiationToken);
    assert.isUndefined(user.activiationTokenExpiry);
    assert.isTrue(user.verified);

    db.close();
});
