const DrawCard = require('../../../drawcard.js');

class Tithe extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel character to gain 2 gold',
            cost: ability.costs.kneel(card => card.isFaction('neutral') && card.getType() === 'character'),
            handler: context => {
                this.game.addGold(this.controller, 2);
                this.game.addMessage('{0} uses {1} to kneel {2} to gain 2 gold',
                    this.controller, this, context.kneelingCostCard);
            }
        });
    }
}

Tithe.code = '03045';

module.exports = Tithe;
