const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class TheBastardsBoys extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice to put character into play',
            phase: 'challenge',
            target: {
                cardCondition: { location: 'hand', controller: 'current', printedCostOrLower: 5, or: [{ not: { faction: 'stark' } }, { trait: 'House Bolton' }] }
            },
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                this.game.resolveGameAction(GameActions.putIntoPlay({ card: context.target }), context);
            }
        });
    }
}

TheBastardsBoys.code = '24017';

module.exports = TheBastardsBoys;
