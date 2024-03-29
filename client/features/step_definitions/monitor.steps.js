const { Then } = require('cucumber');
const { assert } = require('chai');

Then('I should see the lobby page with title {string}', async function(expectedTitle) {
    let title = await this.driver.getTitle();

    assert.equal(title, expectedTitle, 'Expected title to be ' + expectedTitle);
});
