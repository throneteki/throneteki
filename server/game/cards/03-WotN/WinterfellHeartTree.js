const DrawCard = require('../../drawcard.js');

class WinterfellHeartTree extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card, context) => card.controller === context.player && card.isFaction('stark')
            },
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.immuneTo(card => card.controller !== context.player && card.getType() === 'plot')
                }));

                this.game.addMessage('{0} sacrifices {1} to grant {2} immunity from opponents\' plot effects until the end of the phase',
                    context.player, this, context.target);
            }
        });
    }
}

WinterfellHeartTree.code = '03018';

module.exports = WinterfellHeartTree;
