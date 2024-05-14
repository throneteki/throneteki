const PlotCard = require('../../plotcard.js');

class MarchingOrders extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [
                ability.effects.cannotMarshal((card) =>
                    ['location', 'attachment'].includes(card.getPrintedType())
                ),
                ability.effects.cannotPlay((card) => card.getPrintedType() === 'event')
            ]
        });
    }
}

MarchingOrders.code = '01016';

module.exports = MarchingOrders;
