import DrawCard from '../../drawcard.js';

class DothrakiHonorGuard extends DrawCard {
    // Dothraki Honor Guard (07035)
    // No attachments.
    // Dothraki Honor Guard gets -1 STR for each card in your hand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicDecreaseStrength((card, context) =>
                context.source.controller.getHandCount()
            )
        });
    }
}

DothrakiHonorGuard.code = '07035';

export default DothrakiHonorGuard;
