const DrawCard = require('../../drawcard.js');

class BrightWaterKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce Knight character',
            phase: 'marshal',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardGold(),
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    effect: ability.effects.reduceNextMarshalledCardCost(
                        2,
                        (card) => card.getType() === 'character' && card.hasTrait('Knight')
                    )
                }));

                this.game.addMessage(
                    '{0} discards 1 gold from {1} to reduce the next knight character they marshal this phase by 2',
                    context.player,
                    this
                );
            }
        });
    }
}

BrightWaterKnight.code = '08023';

module.exports = BrightWaterKnight;
