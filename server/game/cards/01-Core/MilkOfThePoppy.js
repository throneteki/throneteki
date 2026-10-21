import DrawCard from '../../drawcard.js';

class MilkOfThePoppy extends DrawCard {
    // Milk of the Poppy (01035)
    // Terminal.
    // Treat attached character's printed text box as if it were blank (except for Traits).
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.blankExcludingTraits
        });
    }
}

MilkOfThePoppy.code = '01035';

export default MilkOfThePoppy;
