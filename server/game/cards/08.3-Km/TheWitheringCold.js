const PlotCard = require('../../plotcard.js');

class TheWitheringCold extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.skipPhase('standing')
        });
    }
}

TheWitheringCold.code = '08060';

module.exports = TheWitheringCold;
