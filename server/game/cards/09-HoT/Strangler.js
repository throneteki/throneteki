const DrawCard = require('../../drawcard.js');

class Strangler extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => this.parent.isParticipating(),
            effect: ability.effects.setStrength(1)
        });
    }
}

Strangler.code = '09043';

module.exports = Strangler;
