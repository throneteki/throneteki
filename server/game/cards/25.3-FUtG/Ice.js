const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class Ice extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true, faction: 'stark' });
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.reaction({
            when: {
                onCardSaved: event => event.card.getType() === 'character'
            },
            cost: ability.costs.kneelSelf(),
            gameAction: GameActions.kill(context => ({ card: context.event.card }))
        });
    }
}

Ice.code = '25052';

module.exports = Ice;
