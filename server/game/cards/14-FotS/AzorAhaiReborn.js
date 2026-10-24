import DrawCard from '../../drawcard.js';

class AzorAhaiReborn extends DrawCard {
    // Azor Ahai Reborn (14020)
    // Unique character you control only. Terminal.
    // Attached character is considered to be participating in each challenge in which you control
    // an attacking R'hllor character.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true, controller: 'current' });

        this.whileAttached({
            condition: (context) => hasAttackingRhllor(context.source),
            effect: ability.effects.consideredToBeAttacking()
        });
    }
}

function hasAttackingRhllor(azorAhai) {
    return azorAhai.controller.anyCardsInPlay(
        (card) =>
            card.isAttacking() &&
            card.getType() === 'character' &&
            card.hasTrait("R'hllor") &&
            card !== azorAhai.parent
    );
}

AzorAhaiReborn.code = '14020';

export default AzorAhaiReborn;
