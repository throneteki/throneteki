import DrawCard from '../../drawcard.js';

class Ward extends DrawCard {
    // Ward (02102)
    // Character with printed cost 4 or lower only. Terminal.
    // Take control of attached character.
    // Attached character gains the [stark] affiliation.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ printedCostOrLower: 4 });
        this.whileAttached({
            effect: [
                ability.effects.addFaction('stark'),
                ability.effects.takeControl((context) => context.source.controller)
            ]
        });
    }
}

Ward.code = '02102';

export default Ward;
