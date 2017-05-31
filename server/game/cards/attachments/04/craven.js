const DrawCard = require('../../../drawcard.js');

class Craven extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cannotBeDeclaredAsAttacker()
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Craven.code = '04026';

module.exports = Craven;
