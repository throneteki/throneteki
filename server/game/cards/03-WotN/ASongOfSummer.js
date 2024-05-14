const PlotCard = require('../../plotcard.js');

class ASongOfSummer extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game
                    .getPlayers()
                    .every((player) => !player.activePlot || !player.activePlot.hasTrait('Winter')),
            match: (card) => card.getType() === 'character',
            effect: ability.effects.modifyStrength(1)
        });
    }
}

ASongOfSummer.code = '03050';

module.exports = ASongOfSummer;
