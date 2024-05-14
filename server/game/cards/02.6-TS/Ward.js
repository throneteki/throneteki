import DrawCard from '../../drawcard.js';

class Ward extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ printedCostOrLower: 4 });
        this.whileAttached({
            effect: [
                ability.effects.addFaction('stark'),
                ability.effects.takeControl(() => this.controller)
            ]
        });
    }
}

Ward.code = '02102';

export default Ward;
