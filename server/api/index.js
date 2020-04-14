const account = require('./account');
const events = require('./events');
const decks = require('./decks');
const cards = require('./cards');
const news = require('./news');
const user = require('./user');
const messages = require('./messages');
const banlist = require('./banlist');

module.exports.init = function(server, options) {
    account.init(server, options);
    decks.init(server, options);
    cards.init(server, options);
    news.init(server, options);
    user.init(server, options);
    messages.init(server, options);
    banlist.init(server, options);
    events.init(server, options);
};
