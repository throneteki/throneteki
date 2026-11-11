import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Dirk extends DrawCard {
    // Dirk (26069)
    // Forced Reaction: After a character is discarded from play, place it in its owner's dead pile.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardDiscarded: (event) =>
                    event.card.getType() === 'character' &&
                    event.originalLocation === 'play area' &&
                    event.card.location === 'discard pile'
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
