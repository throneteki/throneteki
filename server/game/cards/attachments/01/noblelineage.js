const DrawCard = require('../../../drawcard.js');

class NobleLineage extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addIcon('power')
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

NobleLineage.code = '01036';

module.exports = NobleLineage;
