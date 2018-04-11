const DrawCard = require('../../drawcard.js');

class DothrakiHonorGuard extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicDecreaseStrength(() => this.controller.hand.size())
        });
    }
}

DothrakiHonorGuard.code = '07035';

module.exports = DothrakiHonorGuard;
