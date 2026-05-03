import DrawCard from '../../drawcard.js';

class Boots extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true, printedCostOrLower: 3 });
        this.whileAttached({
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

Boots.code = '00162';

export default Boots;
