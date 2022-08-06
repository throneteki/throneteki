const DrawCard = require('../../drawcard.js');

class GulltownMerchant extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to reduce',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to reduce to cost of the next House Arryn card they marshal or play by 1',
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    condition: () => !context.abilityDeactivated,
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledOrPlayedCardCost(
                        1,
                        card => card.hasTrait('House Arryn')
                    )
                }));
            }
        });
    }
}

GulltownMerchant.code = '23030';

module.exports = GulltownMerchant;
