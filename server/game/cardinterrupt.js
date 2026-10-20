import PromptedTriggeredAbility from './promptedtriggeredability.js';

function interruptType(properties) {
    if (properties.canCancel) {
        return 'cancelinterrupt';
    }

    return properties.would ? 'wouldinterrupt' : 'interrupt';
}

class CardInterrupt extends PromptedTriggeredAbility {
    constructor(game, card, properties) {
        super(game, card, interruptType(properties), properties);
    }
}

export default CardInterrupt;
