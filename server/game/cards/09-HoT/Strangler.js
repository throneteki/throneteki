const DrawCard = require('../../drawcard.js');

class Strangler extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isParticipating(this.parent),
            effect: ability.effects.setStrength(1)
        });
    }
}

Strangler.code = '09043';

module.exports = Strangler;
