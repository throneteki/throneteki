const account = require('./account');
const decks = require('./decks');
const cards = require('./cards');
const news = require('./news');
const user = require('./user');
const messages = require('./messages');

module.exports.init = function(server, options) {
    account.init(server, options);
    decks.init(server, options);
    cards.init(server, options);
    news.init(server, options);
    user.init(server, options);
    messages.init(server, options);
};
