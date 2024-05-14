import PromptedTriggeredAbility from './promptedtriggeredability.js';

class CardReaction extends PromptedTriggeredAbility {
    constructor(game, card, properties) {
        super(game, card, 'reaction', properties);
    }
}

export default CardReaction;
