const DrawCard = require('../../../drawcard.js');

class MaryaSeaworth extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: context => 'Kneel ' + context.event.target.name,
            when: {
                onBypassedByStealth: () => true
            },
            cost: ability.costs.payGold(1),
            limit: ability.limit.perPhase(2),
            handler: context => {
                let target = context.event.target;
                target.controller.kneelCard(target);
                this.game.addMessage('{0} uses {1} and pays 1 gold to kneel {2}', this.controller, this, target);
            }
        });
    }
}

MaryaSeaworth.code = '07025';

module.exports = MaryaSeaworth;
