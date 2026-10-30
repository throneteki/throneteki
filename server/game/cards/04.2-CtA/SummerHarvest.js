import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class SummerHarvest extends PlotCard {
    // Summer Harvest (04039)
    // When Revealed: Choose an opponent. X is 2 higher than the printed gold value on that player's
    // revealed plot card.
    setupCardAbilities(ability) {
        this.whenRevealed({
            chooseOpponent: true,
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'custom',
                until: {
                    onCardLeftPlay: (event) => event.card === context.source
                },
                match: context.source,
                targetController: 'any',
                effect: ability.effects.setBaseGold(
                    context.opponent.activePlot.income.printedValue + 2
                )
            }))
        });
    }
}

SummerHarvest.code = '04039';

export default SummerHarvest;
