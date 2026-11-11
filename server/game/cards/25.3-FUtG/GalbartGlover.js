import DrawCard from '../../drawcard.js';

class GalbartGlover extends DrawCard {
    // Galbart Glover (25051)
    // While there are more Winter plot cards than Summer plot cards revealed, increase the cost of
    // the first character each opponent marshals or ambushes each phase by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.moreWinterThanSummerPlotsRevealed(),
            targetController: 'opponent',
            effect: ability.effects.increaseCost({
                playingTypes: ['marshal', 'ambush'],
                amount: 1,
                match: (card) => card.getPrintedType() === 'character',
                limit: ability.limit.perPhase(1)
            })
        });
    }

    moreWinterThanSummerPlotsRevealed() {
        let winterPlots = this.game
            .getPlayers()
            .filter((player) => player.activePlot && player.activePlot.hasTrait('Winter'));
        let summerPlots = this.game
            .getPlayers()
            .filter((player) => player.activePlot && player.activePlot.hasTrait('Summer'));

        return winterPlots.length > summerPlots.length;
    }
}

GalbartGlover.code = '25051';

export default GalbartGlover;
