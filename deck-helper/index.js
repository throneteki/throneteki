import DeckValidator from './DeckValidator.js';
export { formatDeckAsFullCards } from './formatDeckAsFullCards.js';
export { formatDeckAsShortCards } from './formatDeckAsShortCards.js';

export const validateDeck = (deck, options) => {
    options = Object.assign({ includeExtendedStatus: true }, options);

    let validator = new DeckValidator(options.packs, options.restrictedLists, options.customRules);
    let result = validator.validateDeck(deck);

    if (!options.includeExtendedStatus) {
        delete result.extendedStatus;
    }

    return result;
};
