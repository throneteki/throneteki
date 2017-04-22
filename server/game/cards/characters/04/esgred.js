const DrawCard = require('../../../drawcard.js');

class Esgred extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.addStealthLimit(1)
        });
    }
}

Esgred.code = '04111';

module.exports = Esgred;
