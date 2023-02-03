const DrawCard = require('../../drawcard.js');

class StalwartShields extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            targetController: 'opponent',
            effect: ability.effects.cannotTriggerCardAbilities(ability => ability.card.getType() === 'character' 
                                                                            && ability.card.controller !== this.controller
                                                                            && ability.card.hasTrait('Army'))
        });
    }
}

StalwartShields.code = '24020';

module.exports = StalwartShields;
