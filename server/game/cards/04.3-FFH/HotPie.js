const DrawCard = require('../../drawcard.js');

class HotPie extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next marshalled character',
            phase: 'marshal',
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Companion') && card.getType() === 'character'
            ),
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    effect: ability.effects.reduceNextMarshalledCardCost(
                        1,
                        (card) => card.isUnique() && card.getType() === 'character'
                    )
                }));

                this.game.addMessage(
                    '{0} uses {1} and kneels {2} to reduce the cost of the next unique character they marshal this phase by 1',
                    context.player,
                    this,
                    context.costs.kneel
                );
            }
        });
    }
}

HotPie.code = '04057';

module.exports = HotPie;
