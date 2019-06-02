const DrawCard = require('../../drawcard');

class AzorAhaiReborn extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true, controller: 'current' });

        this.persistentEffect({
            condition: () => this.hasAttackingRhllor(),
            match: this,
            effect: ability.effects.consideredToBeAttacking()
        });
    }

    hasAttackingRhllor() {
        return this.controller.anyCardsInPlay(card => (
            card.isAttacking() &&
            card.getType() === 'character' &&
            card.hasTrait('R\'hllor')
        ));
    }
}

AzorAhaiReborn.code = '14020';

module.exports = AzorAhaiReborn;
