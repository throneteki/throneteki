import AgendaCard from '../../agendacard.js';

class KingsOfWinter extends AgendaCard {
    // Kings of Winter (04038)
    // You cannot include Summer plot cards in your plot deck.
    // Reduce the reserve value on each player's revealed plot card by 1. While you have a Winter
    // plot card revealed, reduce the gold value on each opponent's non-Summer plot card by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card === card.controller.activePlot,
            effect: ability.effects.modifyReserve(-1)
        });
        this.persistentEffect({
            condition: () =>
                this.controller.activePlot && this.controller.activePlot.hasTrait('Winter'),
            targetController: 'opponent',
            match: (card) => card === card.controller.activePlot && !card.hasTrait('Summer'),
            effect: ability.effects.modifyGold(-1)
        });
    }
}

KingsOfWinter.code = '04038';

export default KingsOfWinter;
