import ForcedTriggeredAbility from './forcedtriggeredability.js';

class CardWhenRevealed extends ForcedTriggeredAbility {
    constructor(game, card, properties) {
        super(game, card, 'whenrevealed', properties);
    }
}

export default CardWhenRevealed;
