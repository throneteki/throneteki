import DrawCard from '../../drawcard.js';

class PriestOfOldWyk extends DrawCard {
    // Priest of Old Wyk (12012)
    // While there is a Drowned God character in your dead pile, Priest of Old Wyk contributes its
    // STR to your total for dominance even while kneeling.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.controller.deadPile.some((card) => card.hasTrait('Drowned God')),
            match: this,
            effect: ability.effects.contributesToDominanceWhileKneeling()
        });
    }
}

PriestOfOldWyk.code = '12012';

export default PriestOfOldWyk;
