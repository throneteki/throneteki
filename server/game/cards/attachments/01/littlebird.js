const DrawCard = require('../../../drawcard.js');

class LittleBird extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addIcon('intrigue')
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

LittleBird.code = '01034';

module.exports = LittleBird;
