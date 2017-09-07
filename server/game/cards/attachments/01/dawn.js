const DrawCard = require('../../../drawcard.js');

class Dawn extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.dynamicStrength(() => this.controller.getNumberOfUsedPlots()),
            recalculateWhen: ['onUsedPlotsModified']
        });
        this.whileAttached({
            match: card => card.hasTrait('House Dayne'),
            effect: ability.effects.addKeyword('Intimidate')
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Dawn.code = '01115';

module.exports = Dawn;
