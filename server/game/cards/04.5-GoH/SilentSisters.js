import DrawCard from '../../drawcard.js';

class SilentSisters extends DrawCard {
    // Silent Sisters (04097)
    // Silent Sisters gets +1 STR for each character in your dead pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(
                (card, context) => context.source.controller.deadPile.length
            )
        });
    }
}

SilentSisters.code = '04097';

export default SilentSisters;
