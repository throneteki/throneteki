import ForcedTriggeredAbility from './forcedtriggeredability.js';

class CardForcedReaction extends ForcedTriggeredAbility {
    constructor(game, card, properties) {
        super(game, card, 'forcedreaction', properties);
    }
}

export default CardForcedReaction;
