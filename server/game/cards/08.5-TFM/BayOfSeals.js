const DrawCard = require('../../drawcard.js');

class BayOfSeals extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand character',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: card =>
                    card.location === 'play area'
                    && card.getType() === 'character'
                    && card.kneeled
                    && card.owner !== this.controller
            },
            handler: context => {
                context.target.controller.standCard(context.target);
                this.game.addMessage('{0} kneels {1} to stand {2}', this.controller, this, context.target);
            }
        });
    }
}

BayOfSeals.code = '08086';

module.exports = BayOfSeals;
