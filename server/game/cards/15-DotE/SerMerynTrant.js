import DrawCard from '../../drawcard.js';

class SerMerynTrant extends DrawCard {
    // Ser Meryn Trant (15029)
    // Interrupt: When a card is discarded from an opponent's hand, remove it from the game instead
    // of placing it in his or her discard pile.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardDiscarded: (event) =>
                    event.originalLocation === 'hand' && event.card.controller !== this.controller
            },
            message: {
                format: '{player} uses {source} to remove {card} from the game',
                args: { card: (context) => context.event.card }
            },
            handler: (context) => {
                context.event.replaceHandler((event) => {
                    event.cardStateWhenDiscarded = event.card.createSnapshot();
                    event.card.controller.moveCard(event.card, 'out of game');
                });
            }
        });
    }
}

SerMerynTrant.code = '15029';

export default SerMerynTrant;
