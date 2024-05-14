const DrawCard = require('../../drawcard.js');

class KnightOfSummer extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.moreSummerThanWinterPlots(),
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

module.exports = KnightOfSummer;
