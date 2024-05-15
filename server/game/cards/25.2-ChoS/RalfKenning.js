import DrawCard from '../../drawcard.js';

class RalfKenning extends DrawCard {
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
