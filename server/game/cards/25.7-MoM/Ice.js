const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class Ice extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark' });
        this.reaction({
            when: {
                onCardSaved: event => event.card.getType() === 'character'
            },
            cost: ability.costs.kneelSelf(),
            gameAction: GameActions.kill(context => ({ card: context.event.card }))
        });
    }
}

Ice.code = '25570';
Ice.version = '1.0';

module.exports = Ice;
