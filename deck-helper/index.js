const DeckValidator = require('./DeckValidator');
const formatDeckAsFullCards = require('./formatDeckAsFullCards');
const formatDeckAsShortCards = require('./formatDeckAsShortCards');

module.exports = {
    formatDeckAsFullCards: formatDeckAsFullCards,
    formatDeckAsShortCards: formatDeckAsShortCards,
    validateDeck: function(deck, options) {
        options = Object.assign({ includeExtendedStatus: true }, options);

        let validator = new DeckValidator(options.packs, options.restrictedLists, options.customRules);
        let result = validator.validateDeck(deck);

        if(!options.includeExtendedStatus) {
            delete result.extendedStatus;
        }

        return result;
    }
};
