import PlotCard from '../../plotcard.js';

class SummerHarvest extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            handler: (context) => {
                // Referencing "this" ensures that whichever card is triggering this ability
                // (eg. Summer Harvest OR Varys's Riddle), it refers to Summer Harvest's X
                // TODO: Eventually when conflicting effects is properly implemented, this should 100% reflect
                //       how it works in the physical game (where first player decides the order of conflicting effects)
                this.lastingEffect((ability) => ({
                    until: {
                        onCardLeftPlay: (event) => event.card === this
                    },
                    match: this,
                    targetController: 'any',
                    effect: ability.effects.setBaseGold(
                        context.opponent.activePlot.income.printedValue + 2
                    )
                }));
            }
        });
    }
}

SummerHarvest.code = '04039';

export default SummerHarvest;
