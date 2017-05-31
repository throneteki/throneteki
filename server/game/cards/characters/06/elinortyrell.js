const DrawCard = require('../../../drawcard.js');

class ElinorTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            effect: ability.effects.modifyMaxLimited(1)
        });
    }
}

ElinorTyrell.code = '06043';

module.exports = ElinorTyrell;
