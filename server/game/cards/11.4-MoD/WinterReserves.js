const PlotCard = require('../../plotcard');

class WinterReserves extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () => this.location === 'revealed plots',
            match: (card) => card === card.controller.activePlot && card.hasTrait('Winter'),
            effect: [ability.effects.modifyGold(1), ability.effects.modifyReserve(1)]
        });
    }
}

WinterReserves.code = '11080';

module.exports = WinterReserves;
