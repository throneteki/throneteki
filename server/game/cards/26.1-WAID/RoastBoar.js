import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RoastBoar extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.whileAttached({
            match: this.parent,
            effect: ability.effects.optionalStandDuringStanding()
        });
        this.reaction({
            when: {
                onCardStood: (event) => event.card === this.parent
            },
            cost: ability.costs.sacrificeSelf(),
            message: '{player} sacrifices {source} to draw 3 cards',
            gameAction: GameActions.drawCards({ amount: 3 })
        });
    }
}

RoastBoar.code = '26002';

export default RoastBoar;
