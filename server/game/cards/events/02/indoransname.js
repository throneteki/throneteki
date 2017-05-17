const DrawCard = require('../../../drawcard.js');

class InDoransName extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel faction card to gain gold',
            condition: () => this.controller.getNumberOfUsedPlots() >= 1,
            cost: ability.costs.kneelFactionCard(),
            handler: context => {
                let gold = this.controller.getNumberOfUsedPlots();
                this.game.addGold(this.controller, gold);
                this.game.addMessage('{0} uses {1} to kneel their faction card to gain {2} gold', context.player, this, gold);
            }
        });
    }
}

InDoransName.code = '02036';

module.exports = InDoransName;
