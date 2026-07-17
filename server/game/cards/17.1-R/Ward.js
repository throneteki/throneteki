import DrawCard from '../../drawcard.js';

class Ward extends DrawCard {
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
