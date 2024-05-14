const DrawCard = require('../../drawcard.js');

class SentinelStand extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.kneeled,
            match: (card) => card.getType() === 'character' && card.getNumberOfIcons() <= 1,
            effect: ability.effects.modifyStrength(2)
        });
    }
}

SentinelStand.code = '25010';

module.exports = SentinelStand;
