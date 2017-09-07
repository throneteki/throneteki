const DrawCard = require('../../../drawcard.js');

class HouseTullySepton extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next marshalled character',
            phase: 'marshal',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardPower(1, card => card.getType() === 'character'),
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    effect: ability.effects.reduceNextMarshalledCardCost(
                        2,
                        card => (card.hasTrait('House Tully') || card.hasTrait('The Seven')) && card.getType() === 'character'
                    )
                }));

                this.game.addMessage('{0} uses {1} and discards a power from {2} to reduce the cost of the next House Tully or The Seven character they marshal this phase by 2', 
                    context.player, this, context.discardPowerCostCard);
            }
        });
    }
}

HouseTullySepton.code = '03015';

module.exports = HouseTullySepton;
