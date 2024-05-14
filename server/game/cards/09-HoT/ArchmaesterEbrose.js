const DrawCard = require('../../drawcard.js');

class ArchmaesterEbrose extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Maester character',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Maester') && card.getType() === 'character'
            ),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('Maester') &&
                    card.getType() === 'character' &&
                    card.kneeled
            },
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.addMessage(
                    '{0} uses {1} and kneels {2} to stand {3}',
                    context.player,
                    this,
                    context.costs.kneel,
                    context.target
                );
            }
        });
    }
}

ArchmaesterEbrose.code = '09039';

module.exports = ArchmaesterEbrose;
