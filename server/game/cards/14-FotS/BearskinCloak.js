const DrawCard = require('../../drawcard');

class BearskinCloak extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });

        this.whileAttached({
            match: (card) => card.hasTrait('House Mormont'),
            effect: ability.effects.addKeyword('Stealth')
        });
    }
}

BearskinCloak.code = '14034';

module.exports = BearskinCloak;
