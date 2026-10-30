import DrawCard from '../../drawcard.js';

class KnightOfSummer extends DrawCard {
    // Knight of Summer (04023)
    // While there are more Summer plot cards than Winter plot cards revealed, Knight of Summer gets
    // +2 STR and gains renown.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.moreSummerThanWinterPlots(),
            match: this,
            effect: [ability.effects.addKeyword('Renown'), ability.effects.modifyStrength(2)]
        });
    }

    moreSummerThanWinterPlots() {
        let summerPlots = 0;
        let winterPlots = 0;

        for (let player of this.game.getPlayers()) {
            if (player.activePlot && player.activePlot.hasTrait('winter')) {
                winterPlots++;
            }
            if (player.activePlot && player.activePlot.hasTrait('summer')) {
                summerPlots++;
            }
        }

        return summerPlots > winterPlots;
    }
}
KnightOfSummer.code = '04023';

export default KnightOfSummer;
