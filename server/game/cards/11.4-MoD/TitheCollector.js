import DrawCard from '../../drawcard.js';

class TitheCollector extends DrawCard {
    // Tithe Collector (11069)
    // Reaction: After you collect income, pay 2 gold to have Tithe Collector gain 1 power.
    // +1 Income.
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

export default TitheCollector;
