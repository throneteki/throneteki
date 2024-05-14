const DrawCard = require('../../drawcard.js');

class SparringInSecret extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Knight character',
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Knight') && card.getType() === 'character'
            ),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('Knight') &&
                    card.getType() === 'character' &&
                    card.kneeled
            },
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.addMessage(
                    '{0} plays {1} and kneels {2} to stand {3}',
                    context.player,
                    this,
                    context.costs.kneel,
                    context.target
                );
            }
        });
    }
}

SparringInSecret.code = '08050';

module.exports = SparringInSecret;
