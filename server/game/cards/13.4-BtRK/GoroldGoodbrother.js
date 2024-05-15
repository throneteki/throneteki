import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GoroldGoodbrother extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlaced: (event) =>
                    event.card.getType() === 'location' &&
                    event.card.controller !== this.controller &&
                    event.location === 'discard pile'
            },
            limit: ability.limit.perPhase(2),
            handler: (context) => {
                this.game.resolveGameAction(GameActions.standCard({ card: this }));
                this.game.addMessage(
                    '{0} stands {1} due to {2} entering the discard pile',
                    this.controller,
                    this,
                    context.event.card
                );
            }
        });
    }
}

GoroldGoodbrother.code = '13071';

export default GoroldGoodbrother;
