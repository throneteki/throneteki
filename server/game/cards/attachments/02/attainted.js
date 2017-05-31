const DrawCard = require('../../../drawcard.js');

class Attainted extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.removeIcon('intrigue')
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Attainted.code = '02055';

module.exports = Attainted;
