const DrawCard = require('../../drawcard.js');

class UnderhandedMethods extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.dynamicStrength(() => this.controller.shadows.length)
        });
    }
}

UnderhandedMethods.code = '11110';

module.exports = UnderhandedMethods;
