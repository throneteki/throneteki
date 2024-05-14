import AgendaCard from '../../agendacard.js';

class KingsOfSummer extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card === card.controller.activePlot,
            effect: ability.effects.modifyReserve(1)
        });
        this.persistentEffect({
            condition: () =>
                this.game
                    .getPlayers()
                    .every((player) => player.activePlot && !player.activePlot.hasTrait('Winter')),
            match: (card) => card === card.controller.activePlot && card.hasTrait('Summer'),
            effect: ability.effects.modifyGold(1)
        });
    }
}

KingsOfSummer.code = '04037';

export default KingsOfSummer;
