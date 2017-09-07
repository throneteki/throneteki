const DrawCard = require('../../../drawcard.js');

class Knighted extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyStrength(1),
                ability.effects.addTrait('Knight')
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

Knighted.code = '02058';

module.exports = Knighted;
