const PlotCard = require('../../plotcard.js');

class PeaceAndProsperity extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'current',
            effect: [
                ability.effects.reduceNextMarshalledCardCost(3, card => card.getType() === 'character'),
                ability.effects.reduceNextMarshalledCardCost(2, card => card.getType() === 'location'),
                ability.effects.reduceNextMarshalledCardCost(1, card => card.getType() === 'attachment')
            ]
        });
    }
}

PeaceAndProsperity.code = '10047';

module.exports = PeaceAndProsperity;
