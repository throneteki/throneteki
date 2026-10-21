import DrawCard from '../../drawcard.js';

class RaidingKhalasar extends DrawCard {
    // Raiding Khalasar (08113)
    // No attachments. Pillage.
    // While Raiding Khalasar is attacking, if you control an attacking Bloodrider character, raise
    // the claim value on your revealed plot card by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.isAttacking() && context.source.bloodriderIsAttacking(),
            match: (card, context) => card === context.source.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }

    bloodriderIsAttacking() {
        return this.controller.anyCardsInPlay(
            (card) => card.isAttacking() && card.hasTrait('Bloodrider')
        );
    }
}

RaidingKhalasar.code = '08113';

export default RaidingKhalasar;
