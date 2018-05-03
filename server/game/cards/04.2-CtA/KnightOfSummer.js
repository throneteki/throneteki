const DrawCard = require('../../drawcard.js');
const _ = require('underscore');

class KnightOfSummer extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.moreSummerThanWinterPlots(),
            match: this,
            effect: [
                ability.effects.addKeyword('Renown'),
                ability.effects.modifyStrength(2)
            ]
        });
    }

    moreSummerThanWinterPlots() {
        let summerPlots = 0;
        let winterPlots = 0;

        _.each(this.game.getPlayers(), player => {
            if(player.activePlot && player.activePlot.hasTrait('winter')) {
                winterPlots++;
            }
            if(player.activePlot && player.activePlot.hasTrait('summer')) {
                summerPlots++;
            }
        });

        return summerPlots > winterPlots;
    }
}
KnightOfSummer.code = '04023';

module.exports = KnightOfSummer;
