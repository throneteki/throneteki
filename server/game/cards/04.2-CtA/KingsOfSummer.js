import AgendaCard from '../../agendacard.js';

class KingsOfSummer extends AgendaCard {
    // Kings of Summer (04037)
    // You cannot include Winter plot cards in your plot deck.
    // Increase the reserve value on each player's revealed plot card by 1. While there are no
    // Winter plot cards revealed, increase the gold value on your revealed Summer plot card by 1.
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
