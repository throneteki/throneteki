import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerJorahMormont extends DrawCard {
    // Ser Jorah Mormont (13113)
    // Shadow (4). No attachments except Weapon.
    // Interrupt: When Ser Jorah Mormont is discarded from your hand, put him into shadows instead
    // of placing him in your discard pile.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardDiscarded: (event, context) =>
                    event.card === context.source && event.originalLocation === 'hand'
            },
            location: ['hand'],
            message:
                '{player} uses {source} to put {source} into shadows instead of placing it in their discard pile',
            gameAction: GameActions.replaceEvent((context) => ({
                event: context.event,
                replacement: GameActions.putIntoShadows({ card: context.source })
            }))
        });
    }
}

SerJorahMormont.code = '13113';

export default SerJorahMormont;
