import PlotCard from '../../plotcard.js';

class WinterReserves extends PlotCard {
    // Winter Reserves (11080)
    // While Winter Reserves is in your used pile, increase the gold value and reserve value on your
    // revealed Winter plot card by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: (context) => context.source.location === 'revealed plots',
            match: (card) => card === card.controller.activePlot && card.hasTrait('Winter'),
            effect: [ability.effects.modifyGold(1), ability.effects.modifyReserve(1)]
        });
    }
}

WinterReserves.code = '11080';

export default WinterReserves;
