const DrawCard = require('../../drawcard');

class HuntingAccident extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cannotBeStood()
        });
    }
}

HuntingAccident.code = '14021';

module.exports = HuntingAccident;
