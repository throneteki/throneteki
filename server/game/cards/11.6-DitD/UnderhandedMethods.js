import DrawCard from '../../drawcard.js';

class UnderhandedMethods extends DrawCard {
    // Underhanded Methods (11110)
    // Shadow (0).
    // Attached character gets +1 STR for each card you control in shadows.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.dynamicStrength(
                (card, context) => context.source.controller.shadows.length
            )
        });
    }
}

UnderhandedMethods.code = '11110';

export default UnderhandedMethods;
