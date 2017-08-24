const DrawCard = require('../../../drawcard.js');

class ElinorTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: this.controller.phase !== 'setup',
            targetType: 'player',
            effect: ability.effects.modifyMaxLimited(1)
        });
    }
}

ElinorTyrell.code = '06043';

module.exports = ElinorTyrell;
