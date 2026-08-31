import DeckValidator from './DeckValidator.js';

const draftSets = ['VDS', 'ToJ'];

export const validateDeck = (deck, options) => {
    const { packs, format, variant, legality, customRules, includeExtendedStatus = true } = options;

    const validator = new DeckValidator(packs, format, variant, legality, customRules);
    const result = validator.validateDeck(deck);

    if (!includeExtendedStatus) {
        delete result.extendedStatus;
    }

    return result;
};

export const isDraftCard = (card) => {
    return card && draftSets.includes(card.packCode);
};
