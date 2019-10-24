const PlotCard = require('../../plotcard');

class AtThePalaceOfSorrows extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === 'character',
            targetController: 'any',
            effect: ability.effects.setStrength(3)
        });
    }
}

AtThePalaceOfSorrows.code = '15050';

module.exports = AtThePalaceOfSorrows;
