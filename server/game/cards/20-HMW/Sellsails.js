const DrawCard = require('../../drawcard.js');

class Sellsails extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Smuggler or Warship',
            cost: ability.costs.discardGold(),
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.kneeled &&
                    (card.hasTrait('Smuggler') || card.hasTrait('Warship')),
                gameAction: 'stand'
            },
            message: '{player} discards 1 gold from {source} to stand {target}',
            handler: (context) => {
                context.target.controller.standCard(context.target);
            }
        });
    }
}

Sellsails.code = '20002';

module.exports = Sellsails;
