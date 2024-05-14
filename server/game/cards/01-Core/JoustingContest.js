const PlotCard = require('../../plotcard.js');

class JoustingContest extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: [ability.effects.setAttackerMaximum(1), ability.effects.setDefenderMaximum(1)]
        });
    }
}

JoustingContest.code = '01014';

module.exports = JoustingContest;
