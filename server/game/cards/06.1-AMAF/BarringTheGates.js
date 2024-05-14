const PlotCard = require('../../plotcard.js');

class BarringTheGates extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.cannotPutIntoPlay(
                (card, playingType) => card.getType() === 'character' && playingType !== 'marshal'
            )
        });
    }
}

BarringTheGates.code = '06019';

module.exports = BarringTheGates;
