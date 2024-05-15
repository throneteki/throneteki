import DrawCard from '../../drawcard.js';

class MoatCailin extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.moreWinterThanSummerPlotsRevealed(),
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
