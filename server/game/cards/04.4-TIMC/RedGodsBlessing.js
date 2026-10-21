import DrawCard from '../../drawcard.js';

class RedGodsBlessing extends DrawCard {
    // Red God's Blessing (04068)
    // Attached character gains the R'hllor trait and gets +1 STR for each R'hllor character you
    // control.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addTrait("R'hllor"),
                ability.effects.dynamicStrength(() => this.getNumberOfCardsWithRhllor())
            ]
        });
    }

    getNumberOfCardsWithRhllor() {
        return this.controller.getNumberOfCardsInPlay(
            (c) => c.hasTrait("R'hllor") && c.getType() === 'character'
        );
    }
}

RedGodsBlessing.code = '04068';

export default RedGodsBlessing;
