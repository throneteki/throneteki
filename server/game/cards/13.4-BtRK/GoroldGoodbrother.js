import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GoroldGoodbrother extends DrawCard {
    // Gorold Goodbrother (13071)
    // Pillage. Renown.
    // Reaction: After a location enters an opponent's discard pile, stand Gorold Goodbrother.
    // (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlaced: (event, context) =>
                    event.card.getType() === 'location' &&
                    event.card.controller !== context.source.controller &&
                    event.location === 'discard pile'
            },
            limit: ability.limit.perPhase(2),
            message: {
                format: '{player} stands {source} due to {card} entering the discard pile',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
    }
}

GoroldGoodbrother.code = '13071';

export default GoroldGoodbrother;
