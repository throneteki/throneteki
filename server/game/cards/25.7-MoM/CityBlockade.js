const PlotCard = require('../../plotcard.js');

class CityBlockade extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: [
                ability.effects.cannotMarshal(card => card.hasKeyword('limited')),
                ability.effects.cannotPlay(card => card.getPrintedType() === 'event' && card.hasKeyword('limited')),
                ability.effects.cannotPutIntoPlay(card => card.hasKeyword('limited'))
            ]
        });
    }
}

CityBlockade.code = '25614';
CityBlockade.version = '1.0';

module.exports = CityBlockade;