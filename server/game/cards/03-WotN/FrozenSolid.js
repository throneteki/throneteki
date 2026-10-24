import DrawCard from '../../drawcard.js';

class FrozenSolid extends DrawCard {
    // Frozen Solid (03021)
    // Non-limited location with printed cost 3 or lower only. Terminal.
    // Treat attached location's printed text box as if it were blank (except for Traits).
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location', limited: false, printedCostOrLower: 3 });
        this.whileAttached({
            effect: ability.effects.blankExcludingTraits
        });
    }
}

FrozenSolid.code = '03021';

export default FrozenSolid;
