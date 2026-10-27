import { ValidKeywords } from './basecard.js';
import agendaRules from '../../deck-helper/AgendaRules.js';

function isKeyword(sentence) {
    return ValidKeywords.some(
        (keyword) =>
            sentence === keyword ||
            sentence.startsWith(`${keyword} (`) ||
            (keyword === 'no attachments' && sentence.startsWith('no attachments except '))
    );
}

function isKeywordsOnly(text) {
    return text
        .toLowerCase()
        .split(/[.\n]/)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length > 0)
        .every(isKeyword);
}

/**
 * Whether a card needs a card file for the engine to play it. Cards with no text, cards whose text
 * is only keywords the engine reads from card data, and agendas whose text is only deckbuilding
 * rules that deck validation enforces do not.
 */
export function needsImplementation(cardData) {
    const text = (cardData.text || '').trim();
    if (!text || isKeywordsOnly(text)) {
        return false;
    }

    return !(cardData.type === 'agenda' && agendaRules[cardData.code]);
}
