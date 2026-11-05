import DrawCard from '../../drawcard.js';

class Boots extends DrawCard {
    // Boots (25026)
    // Unique character with printed cost 3 or lower only. Ambush (1).
    // Attached character gains renown.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true, printedCostOrLower: 3 });
        this.whileAttached({
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

Boots.code = '25026';

export default Boots;
