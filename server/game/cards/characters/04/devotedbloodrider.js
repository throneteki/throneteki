const DrawCard = require('../../../drawcard.js');

class DevotedBloodrider extends DrawCard {
    setupCardAbilities(ability) {
         this.persistentEffect({
            match: (card) => card.hasTrait('Bloodrider') && card.controller === this.controller,
            effect: ability.effects.modifyStrength(1)
        });
    }
}

DevotedBloodrider.code = '04053';

module.exports = DevotedBloodrider;
