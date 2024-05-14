const DrawCard = require('../../drawcard');

class AzorAhaiReborn extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true, controller: 'current' });

        this.whileAttached({
            condition: () => this.hasAttackingRhllor(),
            effect: ability.effects.consideredToBeAttacking()
        });
    }

    hasAttackingRhllor() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.isAttacking() &&
                card.getType() === 'character' &&
                card.hasTrait("R'hllor") &&
                card !== this.parent
        );
    }
}

AzorAhaiReborn.code = '14020';

module.exports = AzorAhaiReborn;
