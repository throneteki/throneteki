const DrawCard = require('../../drawcard.js');

class InDoransName extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel faction card to gain gold',
            condition: () =>
                this.controller.getNumberOfUsedPlots() >= 1 && this.controller.canGainGold(),
            cost: ability.costs.kneelFactionCard(),
            handler: (context) => {
                let gold = this.controller.getNumberOfUsedPlots();
                gold = this.game.addGold(this.controller, gold);

                this.game.addMessage(
                    '{0} plays {1} and kneels their faction card to gain {2} gold',
                    context.player,
                    this,
                    gold
                );
            }
        });
    }
}

InDoransName.code = '02036';

module.exports = InDoransName;
