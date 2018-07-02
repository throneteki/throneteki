const { When } = require('cucumber');

When('I am on the {string} page', async function(page) {
    await this.driver.get(this.testHost + page);
});
