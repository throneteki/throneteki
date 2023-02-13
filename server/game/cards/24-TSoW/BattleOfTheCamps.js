const PlotCard = require('../../plotcard');

class BattleOfTheCamps extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.mustChooseAsClaim(card => card.hasTrait('Army'))
        });
    }
}

BattleOfTheCamps.code = '24030';

module.exports = BattleOfTheCamps;
