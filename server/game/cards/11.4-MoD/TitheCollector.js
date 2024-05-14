const DrawCard = require('../../drawcard.js');

class TitheCollector extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });

        this.reaction({
            when: {
                onIncomeCollected: (event) =>
                    event.player === this.controller && this.canGainPower()
            },
            cost: ability.costs.payGold(2),
            handler: () => {
                this.modifyPower(1);

                this.game.addMessage(
                    '{0} uses {1} to pay 2 gold and gain 1 power on {1}',
                    this.controller,
                    this
                );
            }
        });
    }
}

TitheCollector.code = '11069';

module.exports = TitheCollector;
