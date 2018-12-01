const DrawCard = require('../../drawcard.js');

class Reckless extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.mustBeDeclaredAsAttacker(),
                ability.effects.mustBeDeclaredAsDefender()
            ]
        });
    }
}

Reckless.code = '12043';

module.exports = Reckless;
