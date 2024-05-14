import PlotCard from '../../plotcard.js';

class SummerHarvest extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            handler: (context) => {
                this.baseIncome = context.opponent.activePlot.getPrintedIncome() + 2;
            }
        });
    }
}

SummerHarvest.code = '04039';

export default SummerHarvest;
