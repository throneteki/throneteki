import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Missandei extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardDiscarded: (event) =>
                    event.card === this && ['draw deck', 'hand'].includes(event.originalLocation)
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
