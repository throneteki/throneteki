const DrawCard = require('../../drawcard.js');

class CrownOfGold extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.addTrait('King'), ability.effects.killByStrength(-4)]
        });
    }
}

CrownOfGold.code = '02034';

module.exports = CrownOfGold;
