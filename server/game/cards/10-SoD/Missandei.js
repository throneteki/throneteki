import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Missandei extends DrawCard {
    // Missandei (10035)
    // Interrupt: When Missandei is discarded from your hand or deck, put her into play instead of
    // placing her in your discard pile.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardDiscarded: (event, context) =>
                    event.card === context.source &&
                    ['draw deck', 'hand'].includes(event.originalLocation)
            },
            location: ['hand', 'draw deck'],
            message:
                '{player} uses {source} to put {source} into play instead of placing it in their discard pile',
            gameAction: GameActions.replaceEvent((context) => ({
                event: context.event,
                replacement: GameActions.putIntoPlay({ card: context.source })
            }))
        });
    }
}

Missandei.code = '10035';

export default Missandei;
