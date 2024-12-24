import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SpearsOfTheMerlingKing extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card.controller === this.controller
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {source} to return {card} to their hand',
                args: { card: (context) => context.event.card }
            },
            handler: (context) => {
                context.event.childEvent.placeCard.replace(
                    GameActions.returnCardToHand({ card: context.event.card }).createEvent()
                );
            }
        });
    }
}

SpearsOfTheMerlingKing.code = '06048';

export default SpearsOfTheMerlingKing;
