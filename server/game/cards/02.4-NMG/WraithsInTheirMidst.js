import PlotCard from '../../plotcard.js';

class WraithsInTheirMidst extends PlotCard {
    // Wraiths in Their Midst (02080)
    // Reduce the reserve value on each opponent's revealed plot card by 2 (to a minimum of 2).
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            match: (card) => card === card.controller.activePlot,
            effect: ability.effects.modifyReserve(-2)
        });
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.setMinReserve(2)
        });
    }
}

WraithsInTheirMidst.code = '02080';

export default WraithsInTheirMidst;
