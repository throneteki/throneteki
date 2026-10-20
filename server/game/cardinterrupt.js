import PromptedTriggeredAbility from './promptedtriggeredability.js';

function isWouldInterrupt(card, properties) {
    if (properties.would !== undefined) {
        return !!properties.would;
    }

    const text = card.cardData?.text || '';
    const parts = text.split(/<b>\s*Interrupt:\s*<\/b>/i);
    if (parts.length !== 2) {
        return false;
    }

    const clause = parts[1].split(/<b>/i)[0];
    return /\bwould\b/i.test(clause);
}

class CardInterrupt extends PromptedTriggeredAbility {
    constructor(game, card, properties) {
        const eventType = properties.canCancel
            ? 'cancelinterrupt'
            : isWouldInterrupt(card, properties)
              ? 'wouldinterrupt'
              : 'interrupt';
        super(game, card, eventType, properties);
    }
}

export default CardInterrupt;
