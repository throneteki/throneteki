const { When, Then } = require('cucumber');
const { until, By } = require('selenium-webdriver');
const { assert } = require('chai');
const faker = require('faker');

When('I enter username: {string}', async function (username) {
    await this.driver.findElement(By.id('username')).sendKeys(username);
});

When('I enter email address: {string}', async function (email) {
    await this.driver.findElement(By.id('email')).sendKeys(email);
});

When('I click the register button', async function () {
    await this.driver.findElement(By.css('form button')).click();
});

When('I enter password: {string}', async function (password) {
    await this.driver.findElement(By.id('password')).sendKeys(password);
});

When('I enter the second password: {string}', async function (password) {
    await this.driver.findElement(By.id('password1')).sendKeys(password);
});

When('I enter valid registration data', async function () {
    await this.driver.findElement(By.id('username')).sendKeys(faker.internet.userName().replace('.', '_'));
    await this.driver.findElement(By.id('email')).sendKeys(faker.internet.email());
    let password = faker.internet.password();
    await this.driver.findElement(By.id('password')).sendKeys(password);
    await this.driver.findElement(By.id('password1')).sendKeys(password);
});

When('I clear the email address field', async function () {
    await this.driver.findElement(By.id('email')).clear();
});

Then('the username error {string} should display', async function (expectedMessage) {
    let error = await this.driver.findElement(By.id('username-error')).getText();

    assert.equal(error, expectedMessage);
});

Then('the email address error {string} should display', async function (expectedMessage) {
    let error = await this.driver.findElement(By.id('email-error')).getText();

    assert.equal(error, expectedMessage);
});

Then('the password error {string} should display', async function (expectedMessage) {
    let error = await this.driver.findElement(By.id('password-error')).getText();

    assert.equal(error, expectedMessage);
});

Then('the password 1 error {string} should display', async function (expectedMessage) {
    let error = await this.driver.findElement(By.id('password1-error')).getText();

    assert.equal(error, expectedMessage);
});

Then('I should see the {string} alert', async function (expectedMessage) {
    let alert = await this.driver.wait(until.elementLocated(By.css('.alert span:nth-child(2)')), 5000);
    let message = await alert.getText();

    assert.equal(message.trim(), expectedMessage);
});

Then('no email address errors should display', async function () {
    let elements = await this.driver.findElements(By.id('email-error'));

    assert.lengthOf(elements, 0);
});
