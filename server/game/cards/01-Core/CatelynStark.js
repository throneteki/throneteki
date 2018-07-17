const DrawCard = require('../../drawcard.js');

class CatelynStark extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.cannotTriggerCardAbilities()
        });
    }
}

CatelynStark.code = '01143';

module.exports = CatelynStark;
