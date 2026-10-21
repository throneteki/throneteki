import DrawCard from '../../drawcard.js';

class RalfKenning extends DrawCard {
    // Ralf Kenning (25023)
    // Pillage.
    // While there is a Winter plot card revealed, reduce the income and reserve values on each
    // opponent's revealed plot card by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game
                    .getPlayers()
                    .some((player) => player.activePlot && player.activePlot.hasTrait('Winter')),
            match: (card) => card === card.controller.activePlot,
            targetController: 'opponent',
            effect: [ability.effects.modifyGold(-1), ability.effects.modifyReserve(-1)]
        });
    }
}

RalfKenning.code = '25023';

export default RalfKenning;
