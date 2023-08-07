const DrawCard = require('../../drawcard.js');

class Boots extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true, printedCostOrLower: 3 });
        this.whileAttached({
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

Boots.code = '25534';
Boots.version = '1.0';

module.exports = Boots;
