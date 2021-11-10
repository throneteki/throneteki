const DrawCard = require('../../drawcard.js');

class Longtable extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.hasTrait('Small Council') && card.controller === this.controller,
            effect: ability.effects.modifyStrength(1)
        });
      
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstCardCostEachPhase(['marshal', 'ambush', 'outOfShadows'], 1, card => card.hasTrait('Small Council') || card.hasTrait('Spy'))
        });
    }
}

Longtable.code = '21023';

module.exports = Longtable;
