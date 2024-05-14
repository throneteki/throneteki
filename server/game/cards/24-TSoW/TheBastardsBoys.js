const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class TheBastardsBoys extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice to put character into play',
            phase: 'challenge',
            target: {
                cardCondition: {
                    location: 'hand',
                    controller: 'current',
                    type: 'character',
                    printedCostOrLower: 5,
                    or: [{ not: { faction: 'stark' } }, { trait: 'House Bolton' }],
                    condition: (card, context) => context.player.canPutIntoPlay(card)
                }
            },
            cost: ability.costs.sacrificeSelf(),
            message:
                '{player} sacrifices {costs.sacrifice} to put {target} into play from their hand',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay({ card: context.target }),
                    context
                );
            }
        });
    }
}

TheBastardsBoys.code = '24017';

module.exports = TheBastardsBoys;
