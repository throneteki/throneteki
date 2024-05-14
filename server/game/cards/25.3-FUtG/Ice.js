import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Ice extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true, faction: 'stark' });
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.reaction({
            when: {
                onCardSaved: (event) => event.card.getType() === 'character'
            },
            cost: ability.costs.kneelSelf(),
            gameAction: GameActions.kill((context) => ({ card: context.event.card }))
        });
    }
}

Ice.code = '25052';

export default Ice;
