const PlotCard = require('../../plotcard.js');

class ForTheRealm extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstMarshalledCardCostEachRound(4, card => card.hasTrait('Army') || card.hasTrait('Stronghold'))
        });
    }
}

ForTheRealm.code = '21029';

module.exports = ForTheRealm;
