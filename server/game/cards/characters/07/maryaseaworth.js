const DrawCard = require('../../../drawcard.js');

class MaryaSeaworth extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBypassedByStealth: () => true
            },
            cost: ability.costs.payGold(1),
            limit: ability.limit.perPhase(2),
            handler: context => {
                context.target.controller.kneelCard(context.event.target);
                this.game.addMessage('{0} uses {1} and pays 1 gold to kneel {2}', this.controller, this, context.event.target);
            }
        });
    }
}

MaryaSeaworth.code = '07025';

module.exports = MaryaSeaworth;
