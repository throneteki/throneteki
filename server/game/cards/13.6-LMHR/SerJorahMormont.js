import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerJorahMormont extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardDiscarded: (event) => event.card === this && event.originalLocation === 'hand'
            },
            location: ['hand'],
            message:
                '{player} uses {source} to put {source} into shadows instead of placing him in their discard pile',
            handler: (context) => {
                context.event.replaceChildEvent(
                    'onCardPlaced',
                    GameActions.putIntoShadows({ card: this }).createEvent()
                );
            }
        });
    }
}

SerJorahMormont.code = '13113';

export default SerJorahMormont;
