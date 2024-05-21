import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Missandei extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardDiscarded: (event) =>
                    event.card === this &&
                    this.controller.canPutIntoPlay(this) &&
                    ['draw deck', 'hand'].includes(event.originalLocation)
            },
            location: ['hand', 'draw deck'],
            message:
                '{player} uses {source} to put {source} into play instead of placing her their discard pile',
            handler: (context) => {
                context.event.childEvent.placeCard.replace(
                    GameActions.putIntoPlay({ card: this }).createEvent()
                );
            }
        });
    }
}

Missandei.code = '10035';

export default Missandei;
