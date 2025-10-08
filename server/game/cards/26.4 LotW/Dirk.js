import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Dirk extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardDiscarded: (event) =>
                    event.card.getType() === 'character' && event.card.location === 'play area'
            },
            message: {
                format: '{controller} is forced by {source} to place {card} in their dead pile',
                args: {
                    controller: (context) => context.event.card.controller,
                    card: (context) => context.event.card
                }
            },
            gameAction: GameActions.placeCard((context) => ({
                card: context.event.card,
                location: 'dead pile'
            }))
        });
    }
}

Dirk.code = '26069';

export default Dirk;
