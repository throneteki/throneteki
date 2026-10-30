import DrawCard from '../../drawcard.js';

class MoatCailin extends DrawCard {
    // Moat Cailin (06012)
    // While there are more Winter plot cards than Summer plot cards revealed, reduce the initiative
    // value on each opponent's revealed plot card by 3, and the reserve value on each opponent's
    // revealed plot card by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.moreWinterThanSummerPlotsRevealed(),
            match: (card) => card === card.controller.activePlot,
            targetController: 'opponent',
            effect: [ability.effects.modifyInitiative(-3), ability.effects.modifyReserve(-1)]
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

MoatCailin.code = '06012';

export default MoatCailin;
