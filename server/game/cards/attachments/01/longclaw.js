const DrawCard = require('../../../drawcard.js');

class Longclaw extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyStrength(1),
                ability.effects.addKeyword('Renown')
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

Longclaw.code = '01135';

module.exports = Longclaw;
