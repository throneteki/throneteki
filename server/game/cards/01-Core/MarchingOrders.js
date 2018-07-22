const PlotCard = require('../../plotcard.js');

class MarchingOrders extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cannotMarshal(card => card.getType() === 'location' || card.getType() === 'attachment')
        });
        this.persistentEffect({
            effect: ability.effects.cannotPlay(card => card.getType() === 'event')
        });
    }
}

MarchingOrders.code = '01016';

module.exports = MarchingOrders;
