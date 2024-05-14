const PlotCard = require('../../plotcard.js');

class TheBloodyFlux extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.getType() === 'character',
            effect: ability.effects.cannotBeSaved()
        });
    }
}

TheBloodyFlux.code = '11040';

module.exports = TheBloodyFlux;
