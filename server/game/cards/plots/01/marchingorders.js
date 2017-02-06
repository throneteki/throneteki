const PlotCard = require('../../../plotcard.js');

class MarchingOrders extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === 'location' || card.getType() === 'attachment',
            targetLocation: 'hand',
            effect: ability.effects.cannotMarshal()
        });
    }
    canPlay(player, card) {
        if(this.controller !== player || this.controller !== card.controller) {
            return true;
        }

        if(card.getType() === 'event') {
            return false;
        }

        return true;
    }
}

MarchingOrders.code = '01016';

module.exports = MarchingOrders;
