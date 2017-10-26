const PlotCard = require('../../plotcard.js');

class Beseiged extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'any',
            effect: ability.effects.setDefenderMinimum(1)
        });
    }
}

Beseiged.code = '09047';

module.exports = Beseiged;
