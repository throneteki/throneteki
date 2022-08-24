const DrawCard = require('../../drawcard.js');

class GulltownMerchant extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to reduce',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to reduce to cost of the next House Arryn character they marshal by 1',
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    condition: () => !context.abilityDeactivated,
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledCardCost(
                        1,
                        card => card.hasTrait('House Arryn') && card.getType() === 'character'
                    )
                }));
            }
        });
    }
}

GulltownMerchant.code = '23030';

module.exports = GulltownMerchant;
