const DrawCard = require('../../drawcard.js');

class CrownOfGold extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addTrait('King'),
                ability.effects.killByStrength(-4)
            ]
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

CrownOfGold.code = '02034';

module.exports = CrownOfGold;
