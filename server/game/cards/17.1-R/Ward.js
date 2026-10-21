import DrawCard from '../../drawcard.js';

class Ward extends DrawCard {
    // Ward (17126)
    // Unique character with printed cost 4 or lower only. Terminal.
    // Take control of attached character.
    // Attached character gains prized 1 (prized 2 instead if attached character's printed cost is 3
    // or higher).
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true, printedCostOrLower: 4 });

        this.whileAttached({
            effect: ability.effects.takeControl(() => this.controller)
        });

        this.whileAttached({
            match: (card) => card.getPrintedCost() < 3,
            effect: ability.effects.addKeyword('Prized 1')
        });

        this.whileAttached({
            match: (card) => card.getPrintedCost() > 2,
            effect: ability.effects.addKeyword('Prized 2')
        });
    }
}

Ward.code = '17126';

export default Ward;
