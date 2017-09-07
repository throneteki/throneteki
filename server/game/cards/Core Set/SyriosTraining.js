const DrawCard = require('../../../drawcard.js');

class SyriosTraining extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addIcon('military')
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

SyriosTraining.code = '01037';

module.exports = SyriosTraining;
