import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
                onIncomeCollected: (event, context) =>
                    event.player === context.source.controller && context.source.canGainPower()
            },
            cost: ability.costs.payGold(2),
            message: '{player} uses {source} to pay 2 gold and gain 1 power on {source}',
            gameAction: GameActions.gainPower((context) => ({ card: context.source, amount: 1 }))
        });
    }
}

TitheCollector.code = '11069';

export default TitheCollector;
