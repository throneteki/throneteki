const DrawCard = require('../../drawcard.js');

class StannisBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.cannotStandMoreThan(2, (card) => card.getType() === 'character')
        });
    }
}

StannisBaratheon.code = '01052';

module.exports = StannisBaratheon;
