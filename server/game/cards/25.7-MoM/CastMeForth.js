const PlotCard = require('../../plotcard.js');

class CastMeForth extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.canAmbush(card =>
                card.controller === this.controller &&
                card.location === 'dead pile' &&
                card.getType() === 'character' &&
                card.hasTrait('Drowned God') &&
                !card.isUnique())
        });
        this.persistentEffect({
            targetLocation: ['hand', 'dead pile'],
            match: card => card.hasTrait('Drowned God'),
            effect: ability.effects.gainAmbush()
        });
    }
}

CastMeForth.code = '25524';
CastMeForth.version = '1.0';

module.exports = CastMeForth;
