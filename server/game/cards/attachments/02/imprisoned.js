const DrawCard = require('../../../drawcard.js');

class Imprisoned extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.removeIcon('military')
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Imprisoned.code = '02116';

module.exports = Imprisoned;
