import ForcedTriggeredAbility from './forcedtriggeredability.js';

class CardForcedInterrupt extends ForcedTriggeredAbility {
    constructor(game, card, properties) {
        super(game, card, 'forcedinterrupt', properties);
    }
}

export default CardForcedInterrupt;
