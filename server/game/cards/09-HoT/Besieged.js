const PlotCard = require('../../plotcard.js');

class Besieged extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'any',
            effect: ability.effects.setDefenderMinimum(1)
        });
    }
}

Besieged.code = '09047';

module.exports = Besieged;
