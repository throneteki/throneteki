const DrawCard = require('../../../drawcard.js');

class Condemned extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.removeIcon('power')
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Condemned.code = '02077';

module.exports = Condemned;
