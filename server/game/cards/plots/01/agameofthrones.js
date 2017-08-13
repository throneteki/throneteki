const PlotCard = require('../../../plotcard.js');

class AGameOfThrones extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'any',
            effect: ability.effects.needsToWinIntrigueFirst()
        });
    }
}

AGameOfThrones.code = '01003';

module.exports = AGameOfThrones;
