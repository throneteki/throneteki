const DrawCard = require('../../../drawcard.js');

class RedGodsBlessing extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addTrait('R\'hllor'),
                ability.effects.dynamicStrength(() => this.getNumberOfCardsWithRhllor())
            ]
        });
    }

    getNumberOfCardsWithRhllor() {
        return this.controller.getNumberOfCardsInPlay(c => c.hasTrait('R\'hllor') && c.getType() === 'character');
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

RedGodsBlessing.code = '04068';

module.exports = RedGodsBlessing;
