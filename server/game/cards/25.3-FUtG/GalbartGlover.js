const DrawCard = require('../../drawcard.js');

class GalbartGlover extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.moreWinterThanSummerPlotsRevealed(),
            targetController: 'opponent',
            effect: ability.effects.increaseCost({
                playingTypes: ['marshal', 'ambush'],
                amount: 1,
                match: card => card.getPrintedType() === 'character',
                limit: ability.limit.perPhase(1)
            })
        });
    }

    moreWinterThanSummerPlotsRevealed() {
        let winterPlots = this.game.getPlayers().filter(player => player.activePlot && player.activePlot.hasTrait('Winter'));
        let summerPlots = this.game.getPlayers().filter(player => player.activePlot && player.activePlot.hasTrait('Summer'));

        return winterPlots.length > summerPlots.length;
    }
}

GalbartGlover.code = '25051';

module.exports = GalbartGlover;
