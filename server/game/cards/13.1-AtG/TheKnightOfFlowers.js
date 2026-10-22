import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheKnightOfFlowers extends DrawCard {
    // The Knight of Flowers (13003)
    // Shadow (5). Renown.
    // Reaction: After a card you control comes out of shadows, choose and stand a Kingsguard
    // character. (Limit twice per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) =>
                    event.card.controller === context.source.controller
            },
            limit: ability.limit.perRound(2),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' && card.hasTrait('Kingsguard') && card.kneeled
            },
            message: '{player} uses {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

TheKnightOfFlowers.code = '13003';

export default TheKnightOfFlowers;
