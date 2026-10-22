import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RogueWildling extends DrawCard {
    // Rogue Wildling (12040)
    // Ambush (5).
    // Reaction: After Rogue Wildling enters play, choose and stand a Wildling character you
    // control.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card, context) =>
                    card.controller === context.source.controller &&
                    card.getType() === 'character' &&
                    card.hasTrait('Wildling') &&
                    card.kneeled,
                gameAction: 'stand'
            },
            message: '{player} uses {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

RogueWildling.code = '12040';

export default RogueWildling;
