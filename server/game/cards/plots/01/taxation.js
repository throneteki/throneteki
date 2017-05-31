const PlotCard = require('../../../plotcard.js');

class Taxation extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            effect: ability.effects.modifyMaxLimited(1)
        });
    }
}

Taxation.code = '01024';

module.exports = Taxation;
