const DrawCard = require('../../../drawcard.js');

class MilkOfThePoppy extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.blank
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

MilkOfThePoppy.code = '01035';

module.exports = MilkOfThePoppy;
