const DrawCard = require('../../drawcard.js');

class StalwartShields extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            match: card => card.controller !== this.controller && card.hasTrait('Army'),
            effect: ability.effects.losesAllKeywords()
        });
    }
}

StalwartShields.code = '24020';

module.exports = StalwartShields;
