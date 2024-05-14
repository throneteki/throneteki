const DrawCard = require('../../drawcard.js');

class StonyShoreRaider extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel location',
            cost: ability.costs.discardGold(),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'location' &&
                    card.getPrintedCost() <= 3 &&
                    !card.kneeled
            },
            limit: ability.limit.perRound(1),
            handler: (context) => {
                context.target.controller.kneelCard(context.target);
                this.game.addMessage(
                    '{0} discards 1 gold from {1} to kneel {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

StonyShoreRaider.code = '06111';

module.exports = StonyShoreRaider;
