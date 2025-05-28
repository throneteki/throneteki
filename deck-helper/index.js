import DeckValidator from './DeckValidator.js';
export { formatDeckAsFullCards } from './formatDeckAsFullCards.js';
export { formatDeckAsShortCards } from './formatDeckAsShortCards.js';

export const validateDeck = (deck, options) => {
    options = Object.assign({ includeExtendedStatus: true }, options);

    const validator = new DeckValidator(
        options.packs,
        options.gameFormats,
        options.restrictedLists,
        options.customRules
    );
    const result = validator.validateDeck(deck);

    if (!options.includeExtendedStatus) {
        delete result.extendedStatus;
    }

    return result;
};
