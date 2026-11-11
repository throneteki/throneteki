import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerMerynTrant extends DrawCard {
    // Ser Meryn Trant (15029)
    // Interrupt: When a card is discarded from an opponent's hand, remove it from the game instead
    // of placing it in his or her discard pile.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardDiscarded: (event, context) =>
                    event.originalLocation === 'hand' && event.card.controller !== context.player
            },
            message: {
                format: '{player} uses {source} to remove {card} from the game',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.replaceEvent((context) => ({
                event: context.event,
                replacement: GameActions.placeCard({
                    card: context.event.card,
                    location: 'out of game'
                })
            }))
        });
    }
}

SerMerynTrant.code = '15029';

export default SerMerynTrant;
