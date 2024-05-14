const DrawCard = require('../../drawcard.js');

class Irri extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Lord or Lady',
            cost: ability.costs.discardGold(),
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    (card.hasTrait('Lord') || card.hasTrait('Lady')) &&
                    card.kneeled,
                gameAction: 'stand'
            },
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.addMessage(
                    '{0} discards 1 gold from {1} to stand {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

Irri.code = '06093';

module.exports = Irri;
