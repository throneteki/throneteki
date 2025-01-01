import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerDavosSeaworth extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card === this
            },
            message:
                '{player} uses {source} to return {source} to their hand instead of placing him in their dead pile',
            handler: (context) => {
                context.event.replaceChildEvent(
                    'onCardPlaced',
                    GameActions.returnCardToHand({ card: this }).createEvent()
                );
            }
        });
    }
}

SerDavosSeaworth.code = '01050';

export default SerDavosSeaworth;
